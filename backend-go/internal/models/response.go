package models

type AnalyzeResponse struct {
	Summary     string    `json:"summary"`
	ContentType string    `json:"content_type"`
	Findings    []Finding `json:"findings"`
	RiskScore   int       `json:"risk_score"`
	RiskLevel   string    `json:"risk_level"`
	Action      string    `json:"action"`
	Insights    []string  `json:"insights"`
	Reason      string    `json:"reason,omitempty"`
}

type Finding struct {
	Type  string `json:"type"`
	Risk  string `json:"risk"`
	Line  int    `json:"line,omitempty"`
	Value string `json:"value,omitempty"`
}
