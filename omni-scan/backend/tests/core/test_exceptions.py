"""Tests pour les exceptions centralisées"""

from fastapi import HTTPException, status
from app.core.exceptions import (
    OmniScanException,
    FileValidationError,
    OCRProcessingError,
    AIAnalysisError,
    QuotaExceededError,
    AuthenticationError,
    ConfigurationError,
    create_http_exception
)


def test_omniscan_exception_base():
    """Test de l'exception de base"""
    exc = OmniScanException(
        message="Test error",
        status_code=400,
        error_code="TEST_ERROR",
        details={"key": "value"}
    )
    
    assert exc.message == "Test error"
    assert exc.status_code == 400
    assert exc.error_code == "TEST_ERROR"
    assert exc.details == {"key": "value"}


def test_file_validation_error():
    """Test FileValidationError"""
    exc = FileValidationError("Invalid file", file_name="test.exe")
    
    assert exc.message == "Invalid file"
    assert exc.status_code == status.HTTP_400_BAD_REQUEST
    assert exc.error_code == "FILE_VALIDATION_ERROR"
    assert exc.details == {"file_name": "test.exe"}


def test_ocr_processing_error():
    """Test OCRProcessingError"""
    exc = OCRProcessingError("OCR failed", file_name="scan.pdf")
    
    assert exc.message == "OCR failed"
    assert exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert exc.error_code == "OCR_PROCESSING_ERROR"
    assert exc.details == {"file_name": "scan.pdf"}


def test_ai_analysis_error():
    """Test AIAnalysisError"""
    exc = AIAnalysisError("API unavailable", provider="openai")
    
    assert exc.message == "API unavailable"
    assert exc.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert exc.error_code == "AI_ANALYSIS_ERROR"
    assert exc.details == {"provider": "openai"}


def test_quota_exceeded_error():
    """Test QuotaExceededError"""
    exc = QuotaExceededError("Quota exceeded", limit=100, used=105)
    
    assert exc.message == "Quota exceeded"
    assert exc.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    assert exc.error_code == "QUOTA_EXCEEDED"
    assert exc.details == {"limit": 100, "used": 105}


def test_authentication_error():
    """Test AuthenticationError"""
    exc = AuthenticationError()
    
    assert exc.message == "Authentication required"
    assert exc.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc.error_code == "AUTHENTICATION_ERROR"


def test_configuration_error():
    """Test ConfigurationError"""
    exc = ConfigurationError("Missing API key", config_key="OPENAI_API_KEY")
    
    assert exc.message == "Missing API key"
    assert exc.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert exc.error_code == "CONFIGURATION_ERROR"
    assert exc.details == {"config_key": "OPENAI_API_KEY"}


def test_create_http_exception():
    """Test conversion en HTTPException"""
    omniscan_exc = FileValidationError("Test", file_name="test.txt")
    http_exc = create_http_exception(omniscan_exc)
    
    assert isinstance(http_exc, HTTPException)
    assert http_exc.status_code == status.HTTP_400_BAD_REQUEST
    assert http_exc.detail["message"] == "Test"
    assert http_exc.detail["error_code"] == "FILE_VALIDATION_ERROR"
    assert http_exc.detail["file_name"] == "test.txt"