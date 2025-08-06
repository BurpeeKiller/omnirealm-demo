"""Schémas communs et réponses d'erreur"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any


class ErrorResponse(BaseModel):
    """Schéma standard pour les erreurs HTTP"""
    detail: str = Field(..., description="Message d'erreur détaillé")
    status_code: int = Field(..., description="Code de statut HTTP")
    error_type: Optional[str] = Field(None, description="Type d'erreur spécifique")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "Document non trouvé",
                "status_code": 404,
                "error_type": "not_found"
            }
        }
    )


class ValidationErrorResponse(BaseModel):
    """Schéma pour les erreurs de validation"""
    detail: str = Field(..., description="Message d'erreur")
    errors: list[Dict[str, Any]] = Field(..., description="Détails des erreurs de validation")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "Erreur de validation",
                "errors": [
                    {
                        "loc": ["body", "email"],
                        "msg": "invalid email format",
                        "type": "value_error.email"
                    }
                ]
            }
        }
    )


class HealthResponse(BaseModel):
    """Schéma pour le health check"""
    status: str = Field(..., description="État du service")
    timestamp: str = Field(..., description="Timestamp actuel")
    version: str = Field(..., description="Version de l'API")
    services: Optional[Dict[str, bool]] = Field(None, description="État des services")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "healthy",
                "timestamp": "2024-01-15T10:30:00.000Z",
                "version": "2.0.0",
                "services": {
                    "database": True,
                    "ocr": True,
                    "ai": True
                }
            }
        }
    )