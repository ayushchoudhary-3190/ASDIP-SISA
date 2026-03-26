import re
from typing import List, Dict, Any
from collections import defaultdict
from .pattern_detector import PatternDetector

class LogParser:
    def __init__(self):
        self.pattern_detector = PatternDetector()
        # Additional log-specific patterns
        self.log_patterns = {
            'timestamp': re.compile(r'^\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}'),
            'log_level': re.compile(r'\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|TRACE)\b'),
            # Failed login patterns
            'failed_login': re.compile(r'(?i)(failed|invalid|incorrect|denied|unauthorized|wrong.*password|authentication.*failed|login.*failed|access.*denied)', re.IGNORECASE),
            # IP address pattern for tracking
            'ip_address': re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b'),
        }
        # Chunk size for large files (1MB)
        self.chunk_size = 1024 * 1024
        # Threshold for brute-force detection
        self.brute_force_threshold = 3

    def parse_logs(self, content: str) -> List[Dict[str, Any]]:
        """
        Parse log content and return findings with line numbers.
        Handles large files by processing in chunks.
        """
        findings = []
        
        # For small content, process directly
        if len(content) <= self.chunk_size:
            return self._process_log_content(content, 0)
        
        # For large content, process in chunks
        lines = content.split('\n')
        start_line = 0
        
        for i in range(0, len(lines), 100):  # Process 100 lines at a time
            chunk_lines = lines[i:i+100]
            chunk_content = '\n'.join(chunk_lines)
            chunk_findings = self._process_log_content(chunk_content, start_line + i)
            findings.extend(chunk_findings)
            
        return findings
    
    def _process_log_content(self, content: str, line_offset: int) -> List[Dict[str, Any]]:
        """
        Process a chunk of log content and return findings with adjusted line numbers
        """
        findings = []
        lines = content.split('\n')
        
        # Track failed login attempts for brute-force detection
        failed_attempts = defaultdict(list)
        
        for line_num, line in enumerate(lines, 1):
            if not line.strip():  # Skip empty lines
                continue
            
            # Check for failed login patterns
            if self.log_patterns['failed_login'].search(line):
                # Extract IP address if present
                ip_match = self.log_patterns['ip_address'].search(line)
                if ip_match:
                    ip = ip_match.group()
                    failed_attempts[ip].append(line_num + line_offset)
            
            # Use pattern detector to find security-relevant patterns
            line_findings = self.pattern_detector.detect_patterns(line)
            
            # Adjust line numbers in findings
            for finding in line_findings:
                finding['line'] = line_num + line_offset
                findings.append(finding)
        
        # Detect brute-force attempts
        brute_force_findings = self._detect_brute_force(failed_attempts)
        findings.extend(brute_force_findings)
                
        return findings
    
    def _detect_brute_force(self, failed_attempts: Dict[str, List[int]]) -> List[Dict[str, Any]]:
        """
        Detect brute-force login attempts based on multiple failed attempts from same source
        """
        findings = []
        
        for ip, lines in failed_attempts.items():
            if len(lines) >= self.brute_force_threshold:
                finding = {
                    'type': 'brute_force',
                    'risk': 'high',
                    'line': lines[-1],  # Report at the last failed attempt
                    'value': f'{len(lines)} failed login attempts from {ip}',
                    'details': {
                        'ip': ip,
                        'attempts': len(lines),
                        'lines': lines
                    }
                }
                findings.append(finding)
        
        return findings