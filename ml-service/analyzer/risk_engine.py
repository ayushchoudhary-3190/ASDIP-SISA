from typing import List, Dict, Any

class RiskEngine:
    def __init__(self):
        # Risk weights as specified in the document
        self.risk_weights = {
            'critical': 5,   # password, credit card
            'high': 3,       # api_key, token, secret
            'medium': 2,     # stack_trace, debug_mode
            'low': 1         # email, phone, ip
        }

    def classify_findings(self, findings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate risk score and level based on findings
        """
        risk_score = 0
        
        # Sum up the risk weights for all findings
        for finding in findings:
            risk_level = finding.get('risk', 'low')
            risk_score += self.risk_weights.get(risk_level, 1)
        
        # Determine risk level based on score
        if risk_score >= 11:
            risk_level = 'critical'
        elif risk_score >= 7:
            risk_level = 'high'
        elif risk_score >= 4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
            
        return {
            'findings': findings,
            'risk_score': risk_score,
            'risk_level': risk_level
        }