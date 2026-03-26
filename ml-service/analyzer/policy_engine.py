from typing import List, Dict, Any

class PolicyEngine:
    def __init__(self):
        pass

    def apply_policy(self, risk_assessment: Dict[str, Any], mask: bool = False, block_high_risk: bool = False) -> Dict[str, Any]:
        """
        Apply security policies: masking and blocking
        
        Args:
            risk_assessment: Contains findings, risk_score, risk_level
            mask: Whether to mask sensitive values
            block_high_risk: Whether to block critical risk findings
            
        Returns:
            Modified assessment with applied policies
        """
        findings = risk_assessment.get('findings', [])
        risk_score = risk_assessment.get('risk_score', 0)
        risk_level = risk_assessment.get('risk_level', 'low')
        
        # Check if we should block due to high risk
        action = "allowed"
        reason = ""
        critical_count = len([f for f in findings if f.get('risk') == 'critical'])
        high_risk_count = len([f for f in findings if f.get('risk') == 'high'])
        brute_force_count = len([f for f in findings if f.get('type') == 'brute_force'])
        
        if block_high_risk:
            if risk_level == "critical" or (risk_level == "high" and brute_force_count > 0):
                action = "blocked"
                if risk_level == "critical":
                    reason = f"Content contains {critical_count} critical risk items (passwords, credit cards). Blocked by security policy."
                else:
                    reason = f"Detected {brute_force_count} brute-force attack(s). {high_risk_count} high-risk item(s) found. Blocked by security policy."
        
        # Apply masking if requested
        processed_findings = findings
        if mask:
            processed_findings = self._apply_masking(findings)
        
        # Generate summary
        summary = self._generate_summary(processed_findings, risk_level, action)
        
        return {
            "summary": summary,
            "findings": processed_findings,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "action": action,
            "reason": reason
        }
    
    def _apply_masking(self, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Mask sensitive values in findings
        """
        masked_findings = []
        for finding in findings:
            # Create a copy of the finding
            masked_finding = finding.copy()
            
            # Mask the value if it exists and is not already masked
            value = finding.get('value', '')
            if value and not value.startswith('***MASKED***'):
                # Determine masking based on risk level
                risk = finding.get('risk', 'low')
                if risk in ['critical', 'high']:
                    masked_finding['value'] = '***MASKED***'
                # For medium and low risk, we might still mask certain types
                elif finding.get('type') in ['password', 'api_key_openai', 'api_key_generic', 
                                           'secret_token', 'bearer_token', 'credit_card']:
                    masked_finding['value'] = '***MASKED***'
            
            masked_findings.append(masked_finding)
        
        return masked_findings
    
    def _generate_summary(self, findings: List[Dict[str, Any]], risk_level: str, action: str) -> str:
        """
        Generate a human-readable summary of the analysis
        """
        if not findings:
            return "No security findings detected."
        
        # Count findings by risk level
        risk_counts = {}
        for finding in findings:
            risk = finding.get('risk', 'low')
            risk_counts[risk] = risk_counts.get(risk, 0) + 1
        
        # Build summary
        parts = []
        if risk_counts.get('critical', 0) > 0:
            parts.append(f"{risk_counts['critical']} critical risk item(s)")
        if risk_counts.get('high', 0) > 0:
            parts.append(f"{risk_counts['high']} high-risk item(s)")
        if risk_counts.get('medium', 0) > 0:
            parts.append(f"{risk_counts['medium']} medium-risk item(s)")
        if risk_counts.get('low', 0) > 0:
            parts.append(f"{risk_counts['low']} low-risk item(s)")
        
        summary = f"Analysis completed: {', '.join(parts)} found."
        
        if action == "blocked":
            summary += " Access blocked due to critical risk policy."
        elif any(f.get('value') == '***MASKED***' for f in findings):
            summary += " Sensitive values have been masked."
        
        return summary