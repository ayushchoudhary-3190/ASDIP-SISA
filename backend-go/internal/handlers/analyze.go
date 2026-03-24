package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourname/ai-security-platform/backend-go/internal/gateway"
	"github.com/yourname/ai-security-platform/backend-go/internal/models"
)

// AnalyzeHandler handles JSON analysis requests (text, chat, sql)
func AnalyzeHandler(c *gin.Context) {
	var req models.AnalyzeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Validate input type
	if !isValidInputType(req.InputType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input type"})
		return
	}

	// Call ML service
	mlResp, err := gateway.CallMLService(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ML service unavailable"})
		return
	}

	c.JSON(http.StatusOK, mlResp)
}

// AnalyzeUploadHandler handles file upload analysis
func AnalyzeUploadHandler(c *gin.Context) {
	// Get form values
	inputType := c.PostForm("input_type")
	optionsJSON := c.PostForm("options")

	var options models.AnalysisOptions
	if err := json.Unmarshal([]byte(optionsJSON), &options); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid options"})
		return
	}

	// Validate input type
	if !isValidInputType(inputType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input type"})
		return
	}

	// Get file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}

	// Open file
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open file"})
		return
	}
	defer f.Close()

	// Read file content
	content, err := io.ReadAll(f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot read file"})
		return
	}

	// Create request
	req := models.AnalyzeRequest{
		InputType: inputType,
		Content:   string(content),
		Options:   options,
	}

	// Call ML service
	mlResp, err := gateway.CallMLService(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ML service unavailable"})
		return
	}

	c.JSON(http.StatusOK, mlResp)
}

// isValidInputType checks if input type is valid
func isValidInputType(inputType string) bool {
	switch inputType {
	case "text", "file", "sql", "chat", "log":
		return true
	default:
		return false
	}
}
