import os
import tempfile
from typing import Dict, Any
import PyPDF2
import docx

class FileExtractor:
    def __init__(self):
        # Supported file types
        self.supported_types = {
            '.pdf': self._extract_pdf,
            '.docx': self._extract_docx,
            '.txt': self._extract_txt,
            '.log': self._extract_txt  # Treat .log as plain text
        }

    def extract_text(self, file_path: str, file_type: str = None) -> str:
        """
        Extract text from various file formats
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Determine file type from extension if not provided
        if not file_type:
            _, ext = os.path.splitext(file_path)
            file_type = ext.lower()
        
        # Get the appropriate extractor
        extractor = self.supported_types.get(file_type)
        if not extractor:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Extract text
        return extractor(file_path)

    def _extract_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")
        return text

    def _extract_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            raise Exception(f"Error extracting DOCX text: {str(e)}")
        return text

    def _extract_txt(self, file_path: str) -> str:
        """Extract text from TXT/LOG file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                text = file.read()
        except Exception as e:
            raise Exception(f"Error extracting TXT text: {str(e)}")
        return text