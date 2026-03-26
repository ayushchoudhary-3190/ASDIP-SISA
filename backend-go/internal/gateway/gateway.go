package gateway

import (
	"os"

	"github.com/yourname/ai-security-platform/backend-go/internal/models"
)

// MLClient is a global instance of the ML client
var MLClientInstance *MLClient

// InitMLClient initializes the ML client with the service URL from environment
func InitMLClient() {
	mlServiceURL := os.Getenv("ML-URL")
	if mlServiceURL == "" {
		mlServiceURL = "https://asdip-sisa-ml.onrender.com/" // default for development
	}
	MLClientInstance = NewMLClient(mlServiceURL)
}

// CallMLService is a helper function that uses the global ML client
func CallMLService(req models.AnalyzeRequest) (*models.AnalyzeResponse, error) {
	if MLClientInstance == nil {
		InitMLClient()
	}
	return MLClientInstance.Analyze(req)
}
