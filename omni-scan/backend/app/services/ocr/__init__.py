"""
OCR Service Module
Architecture modulaire pour supporter plusieurs moteurs OCR
"""

from .base import OCREngine, OCRResult, OCRConfig, OutputFormat, OCRFeature
from .manager import OCRManager, get_ocr_manager

__all__ = [
    "OCREngine",
    "OCRResult", 
    "OCRConfig",
    "OutputFormat",
    "OCRFeature",
    "OCRManager",
    "get_ocr_manager"
]