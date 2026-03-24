package models

type AnalyzeRequest struct {
	InputType string          `json:"input_type"`  // text|file|sql|chat|log
	Content   string          `json:"content"`
	Options   AnalysisOptions `json:"options"`
}

type AnalysisOptions struct {
	Mask         bool `json:"mask"`
	BlockHighRisk bool `json:"block_high_risk"`
	LogAnalysis  bool `json:"log_analysis"`
}
