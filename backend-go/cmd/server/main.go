package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"github.com/yourname/ai-security-platform/backend-go/internal/handlers"
	"github.com/yourname/ai-security-platform/backend-go/internal/gateway"
	"github.com/yourname/ai-security-platform/backend-go/internal/middleware"
)

func main() {
	// Initialize ML client
	gateway.InitMLClient()

	// Create Gin router
	r := gin.New()

	// Add middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.SecurityHeaders())

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Metrics middleware
	r.Use(func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start)
		status := c.Writer.Status()
		endpoint := c.Request.URL.Path
		handlers.RecordRequest(c.Request.Method, endpoint, http.StatusText(status), duration)
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Metrics endpoint
	r.GET("/metrics", handlers.MetricsHandler)

	// Rate limited endpoints
	limited := r.Group("/")
	limited.Use(middleware.RateLimit())
	{
		limited.POST("/analyze", handlers.AnalyzeHandler)
		limited.POST("/analyze/upload", handlers.AnalyzeUploadHandler)
	}

	// Start server
	port := "8080"
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
