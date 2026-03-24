import re
from typing import List, Dict, Any
from .pattern_detector import PatternDetector

class LogParser:
    def __init__(self):
        self.pattern_detector = PatternDetector()
        # Additional log-specific patterns
        self.log_patterns = {
            'timestamp': re.compile(r'^\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}'),
            'log_level': re.compile(r'\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|TRACE)\b'),
        }
        # Chunk size for large files (1MB)
        self.chunk_size = 1024 * 1024

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
        
        for line_num, line in enumerate(lines, 1):
            if not line.strip():  # Skip empty lines
                continue
                
            # Use pattern detector to find security-relevant patterns
            line_findings = self.pattern_detector.detect_patterns(line)
            
            # Adjust line numbers in findings
            for finding in line_findings:
                finding['line'] = line_num + line_offset
                findings.append(finding)
                
        return findings