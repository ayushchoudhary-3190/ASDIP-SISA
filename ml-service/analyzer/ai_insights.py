import os
import json
import logging
from typing import List, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class AIInsightsGenerator:
    def __init__(self):
        # Initialize Gemini client
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.client = genai.GenerativeModel('gemini-2.0-flash')
        else:
            self.client = None
        
        # System prompt for security analysis
        self.system_prompt = """You are a security analyst. Analyze the findings from a log/data scan and return a JSON object with:
- insights (array of strings): 3-5 specific, actionable findings
Be specific, not generic. Reference actual finding types found. Return ONLY valid JSON, no markdown."""

    async def generate_insights(self, findings: List[Dict[str, Any]], input_type: str) -> List[str]:
        """
        Generate AI-powered insights based on findings
        """
        try:
            # Handle case where Gemini API key is not available
            if not self.client:
                logger.warning("GEMINI_API_KEY not found, returning mock insights")
                return self._generate_mock_insights(findings, input_type)
            
            # Calculate risk score
            risk_score = sum([
                5 if f.get('risk') == 'critical' else 
                3 if f.get('risk') == 'high' else 
                2 if f.get('risk') == 'medium' else 
                1 for f in findings
            ])
            
            # Prepare user prompt
            user_prompt = f"""Findings: {json.dumps(findings, indent=2)}
Input type: {input_type}
Risk score: {risk_score}

Provide a JSON response with an 'insights' key containing an array of 3-5 specific security recommendations."""
            
            # Call Gemini API
            response = self.client.generate_content(
                contents=[
                    {"role": "user", "parts": [{"text": self.system_prompt}]},
                    {"role": "user", "parts": [{"text": user_prompt}]}
                ],
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 500,
                    "response_schema": {"type": "object", "properties": {"insights": {"type": "array", "items": {"type": "string"}}}, "required": ["insights"]}
                }
            )
            
            # Parse response
            content = response.text.strip()
            
            # Try to parse as JSON
            try:
                # Handle potential markdown code blocks
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                
                result = json.loads(content.strip())
                insights = result.get("insights", [])
                # Ensure we return a list of strings
                if isinstance(insights, list):
                    return [str(insight) for insight in insights[:5]]  # Limit to 5 insights
                else:
                    return [str(insights)]
            except json.JSONDecodeError:
                logger.error(f"Failed to parse Gemini response as JSON: {content}")
                return self._generate_mock_insights(findings, input_type)
                
        except Exception as e:
            logger.error(f"Error generating AI insights: {str(e)}")
            return self._generate_mock_insights(findings, input_type)
    
    def _generate_mock_insights(self, findings: List[Dict[str, Any]], input_type: str) -> List[str]:
        """
        Generate mock insights when Gemini API is not available
        """
        if not findings:
            return ["No security findings detected in the input."]
        
        # Count findings by type and risk level
        risk_counts = {}
        type_counts = {}
        
        for finding in findings:
            risk = finding.get('risk', 'low')
            ftype = finding.get('type', 'unknown')
            
            risk_counts[risk] = risk_counts.get(risk, 0) + 1
            type_counts[ftype] = type_counts.get(ftype, 0) + 1
        
        insights = []
        
        # Generate insights based on findings
        if risk_counts.get('critical', 0) > 0:
            insights.append(f"Found {risk_counts['critical']} critical risk item(s) including passwords or credit card numbers requiring immediate remediation.")
        
        if risk_counts.get('high', 0) > 0:
            insights.append(f"Detected {risk_counts['high']} high-risk item(s) such as API keys or tokens that should be rotated immediately.")
        
        if type_counts.get('password', 0) > 0:
            insights.append("Plaintext passwords exposed in logs - immediate credential rotation required.")
            
        if type_counts.get('api_key_openai', 0) > 0 or type_counts.get('api_key_generic', 0) > 0:
            insights.append("API keys detected in logs - potential for unauthorized service access.")
            
        if type_counts.get('email', 0) > 0:
            insights.append(f"Email addresses found ({type_counts['email']} instance(s)) - review data retention policies.")
            
        if type_counts.get('credit_card', 0) > 0:
            insights.append("Credit card numbers detected - potential PCI-DSS compliance violation.")
            
        if type_counts.get('stack_trace', 0) > 0:
            insights.append("Stack traces revealed - potential information disclosure about internal systems.")
            
        if type_counts.get('brute_force', 0) > 0:
            insights.append("Brute-force attack pattern detected - review access controls and consider implementing account lockout policies.")
        
        # Add a general insight if we don't have enough
        if len(insights) < 3:
            insights.append(f"Analysis of {input_type} input completed with {len(findings)} total security findings identified.")
            
        # Limit to 5 insights
        return insights[:5]
