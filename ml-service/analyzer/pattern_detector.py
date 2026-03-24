import re
from typing import List, Dict, Any

class PatternDetector:
    def __init__(self):
        # Compile regex patterns for better performance
        self.patterns = {
            'email': re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
            'phone': re.compile(r'\b(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b'),
            'api_key_openai': re.compile(r'sk-[a-zA-Z0-9]{32,}'),
            'api_key_generic': re.compile(r'(?i)(api[_-]?key|apikey)\s*[=:]\s*[^\s]+'),
            'password': re.compile(r'(?i)(password|passwd|pwd)\s*[=:]\s*[^\s]+'),
            'bearer_token': re.compile(r'Bearer\s+[A-Za-z0-9\-._~+/]+=*'),
            'secret_token': re.compile(r'(?i)(secret|token)\s*[=:]\s*[^\s]+'),
            'stack_trace': re.compile(r'(Exception|Error|Traceback|at .+\.java:\d+)'),
            'ip_address': re.compile(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'),
            'credit_card': re.compile(r'\b(?:\d[ -]?){13,16}\b')
        }
        
        # Risk levels for each pattern type
        self.risk_levels = {
            'email': 'low',
            'phone': 'low',
            'api_key_openai': 'high',
            'api_key_generic': 'high',
            'password': 'critical',
            'bearer_token': 'high',
            'secret_token': 'high',
            'stack_trace': 'medium',
            'ip_address': 'low',
            'credit_card': 'critical'
        }

    def detect_patterns(self, content: str) -> List[Dict[str, Any]]:
        """
        Detect patterns in the given content and return findings
        """
        findings = []
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            for pattern_name, pattern in self.patterns.items():
                matches = pattern.findall(line)
                for match in matches:
                    # For groups in regex, we might get tuples, handle that
                    if isinstance(match, tuple):
                        # Join non-empty groups or take the first non-empty one
                        match_str = ''.join([g for g in match if g]) or match[0] if match else ''
                    else:
                        match_str = match
                    
                    if match_str:  # Only add if we have a meaningful match
                        finding = {
                            'type': pattern_name,
                            'risk': self.risk_levels[pattern_name],
                            'line': line_num,
                            'value': match_str.strip()
                        }
                        findings.append(finding)
        
        return findings