package gateway

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/yourname/ai-security-platform/backend-go/internal/models"
)

// MLClient handles communication with the Python ML service
type MLClient struct {
	httpClient *http.Client
	baseURL    string
}

// NewMLClient creates a new ML client
func NewMLClient(baseURL string) *MLClient {
	return &MLClient{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		baseURL: baseURL,
	}
}

// Analyze sends an analysis request to the ML service
func (c *MLClient) Analyze(req models.AnalyzeRequest) (*models.AnalyzeResponse, error) {
	// Marshal request to JSON
	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	// Send request to ML service
	resp, err := c.httpClient.Post(c.baseURL+"/analyze", "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ML service returned status %d", resp.StatusCode)
	}

	// Unmarshal response
	var mlResp models.AnalyzeResponse
	if err := json.NewDecoder(resp.Body).Decode(&mlResp); err != nil {
		return nil, err
	}

	return &mlResp, nil
}
