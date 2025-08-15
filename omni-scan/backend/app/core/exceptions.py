"""Exceptions centralisées pour OmniScan"""

from typing import Optional, Dict, Any
from fastapi import HTTPException, status


class OmniScanException(Exception):
    """Exception de base pour OmniScan"""
    def __init__(
        self, 
        message: str, 
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "OMNISCAN_ERROR"
        self.details = details or {}
        super().__init__(message)


class FileValidationError(OmniScanException):
    """Erreur de validation de fichier"""
    def __init__(self, message: str, file_name: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="FILE_VALIDATION_ERROR",
            details={"file_name": file_name} if file_name else {}
        )


class OCRProcessingError(OmniScanException):
    """Erreur lors du traitement OCR"""
    def __init__(self, message: str, file_name: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="OCR_PROCESSING_ERROR",
            details={"file_name": file_name} if file_name else {}
        )


class AIAnalysisError(OmniScanException):
    """Erreur lors de l'analyse IA"""
    def __init__(self, message: str, provider: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="AI_ANALYSIS_ERROR",
            details={"provider": provider} if provider else {}
        )


class QuotaExceededError(OmniScanException):
    """Erreur de dépassement de quota"""
    def __init__(self, message: str, limit: int, used: int):
        super().__init__(
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="QUOTA_EXCEEDED",
            details={"limit": limit, "used": used}
        )


class AuthenticationError(OmniScanException):
    """Erreur d'authentification"""
    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTHENTICATION_ERROR"
        )


class ConfigurationError(OmniScanException):
    """Erreur de configuration"""
    def __init__(self, message: str, config_key: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="CONFIGURATION_ERROR",
            details={"config_key": config_key} if config_key else {}
        )


def create_http_exception(exc: OmniScanException) -> HTTPException:
    """Convertir une OmniScanException en HTTPException FastAPI"""
    return HTTPException(
        status_code=exc.status_code,
        detail={
            "message": exc.message,
            "error_code": exc.error_code,
            **exc.details
        }
    )