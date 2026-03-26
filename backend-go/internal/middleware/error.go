package middleware

import (
	"fmt"
	"net/http"
	"os"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// ErrorHandler returns a gin.HandlerFunc (middleware) that recovers from any panics and logs the error
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Log the panic
				logMsg("Panic recovered: %v\n%s", err, string(debug.Stack()))

				// Return 500 Internal Server Error
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": "Internal server error",
				})
			}
		}()
		c.Next()
	}
}

// Simple logger for errors
func logMsg(format string, v ...interface{}) {
	// In a real implementation, this would use a proper logging library
	// For now, we'll just print to stderr
	fmt.Fprintf(os.Stderr, "[ERROR] "+format+"\n", v...)
}
