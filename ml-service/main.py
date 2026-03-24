from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from analyzer.pattern_detector import PatternDetector
from analyzer.log_parser import LogParser
from analyzer.risk_engine import RiskEngine
from analyzer.file_extractor import FileExtractor
from analyzer.ai_insights import AIInsightsGenerator
from analyzer.policy_engine import PolicyEngine

app = FastAPI(title="AI Security Platform ML Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
pattern_detector = PatternDetector()
log_parser = LogParser()
risk_engine = RiskEngine()
file_extractor = FileExtractor()
ai_insights_generator = AIInsightsGenerator()
policy_engine = PolicyEngine()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(request: dict):
    try:
        input_type = request.get("input_type", "text")
        content = request.get("content", "")
        options = request.get("options", {})
        
        # Extract text if needed
        if input_type in ["file", "pdf", "docx"]:
            # In a real implementation, we'd handle file upload here
            # For now, we'll assume content is already extracted
            pass
            
        # Parse logs if needed
        if input_type == "log" or options.get("log_analysis", False):
            findings = log_parser.parse_logs(content)
        else:
            findings = pattern_detector.detect_patterns(content)
        
        # Classify risk
        risk_assessment = risk_engine.classify_findings(findings)
        
        # Generate AI insights
        insights = await ai_insights_generator.generate_insights(findings, input_type)
        
        # Apply policy engine (masking/blocking)
        policy_result = policy_engine.apply_policy(
            risk_assessment, 
            options.get("mask", False),
            options.get("block_high_risk", False)
        )
        
        return {
            "summary": policy_result["summary"],
            "content_type": input_type,
            "findings": policy_result["findings"],
            "risk_score": policy_result["risk_score"],
            "risk_level": policy_result["risk_level"],
            "action": policy_result["action"],
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
