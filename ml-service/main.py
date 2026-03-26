from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi import Form
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest
from starlette.responses import Response
import uvicorn
import os
from analyzer.pattern_detector import PatternDetector
from analyzer.log_parser import LogParser
from analyzer.risk_engine import RiskEngine
from analyzer.file_extractor import FileExtractor
from analyzer.ai_insights import AIInsightsGenerator
from analyzer.policy_engine import PolicyEngine

# File size limit: 5MB
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes

app = FastAPI(title="AI Security Platform ML Service")

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: StarletteRequest, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

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
async def analyze(
    request: Request,
    input_type: str = Form(default="text"),
    content: str = Form(default=""),
    options: str = Form(default="{}"),
    file: UploadFile = File(default=None)
):
    # Check content size (10MB limit for content)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Content too large. Maximum size is 10MB.")
    
    # Check if request is JSON
    content_type = request.headers.get("content-type", "")
    
    if "application/json" in content_type:
        try:
            json_body = await request.json()
            input_type = json_body.get("input_type", input_type)
            content = json_body.get("content", content)
            options = json_body.get("options", options)
        except:
            pass
    try:
        # Parse options if it's a string
        if isinstance(options, str):
            import json
            options = json.loads(options)
        
        # Handle file upload
        if file and (input_type in ["file", "pdf", "docx", "log"] or options.get("log_analysis", False)):
            # Save uploaded file temporarily
            import tempfile
            content_bytes = await file.read()
            
            # Check file size (5MB limit)
            if len(content_bytes) > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
                temp_file.write(content_bytes)
                temp_file_path = temp_file.name
            
            try:
                # Extract text from file
                file_type = None
                if input_type == "pdf":
                    file_type = ".pdf"
                elif input_type == "docx":
                    file_type = ".docx"
                elif input_type in ["file", "log"]:
                    # Determine type from filename
                    filename = file.filename.lower()
                    if filename.endswith('.pdf'):
                        file_type = ".pdf"
                    elif filename.endswith('.docx'):
                        file_type = ".docx"
                    elif filename.endswith('.txt') or filename.endswith('.log'):
                        file_type = ".txt"
                    else:
                        file_type = ".txt"  # Default to text
                
                extracted_content = file_extractor.extract_text(temp_file_path, file_type)
                content = extracted_content
            finally:
                # Clean up temp file
                os.unlink(temp_file_path)
        elif not content and file:
            # If no input_type specified but file provided, try to extract
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
                content_bytes = await file.read()
                temp_file.write(content_bytes)
                temp_file_path = temp_file.name
            
            try:
                # Determine file type from filename
                filename = file.filename.lower()
                if filename.endswith('.pdf'):
                    file_type = ".pdf"
                elif filename.endswith('.docx'):
                    file_type = ".docx"
                elif filename.endswith('.txt') or filename.endswith('.log'):
                    file_type = ".txt"
                else:
                    file_type = ".txt"  # Default to text
                
                extracted_content = file_extractor.extract_text(temp_file_path, file_type)
                content = extracted_content
                if input_type == "text":
                    input_type = "file"
            finally:
                # Clean up temp file
                os.unlink(temp_file_path)
        
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
            "reason": policy_result.get("reason", ""),
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)