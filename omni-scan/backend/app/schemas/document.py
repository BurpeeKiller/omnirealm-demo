"""Schémas Pydantic pour les documents"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Dict, Literal
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    """Statuts possibles d'un document"""
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class FileType(str, Enum):
    """Types de fichiers supportés"""
    PDF = "pdf"
    JPG = "jpg"
    JPEG = "jpeg"
    PNG = "png"
    TIFF = "tiff"
    TIF = "tif"
    BMP = "bmp"


class DocumentUploadResponse(BaseModel):
    """Réponse après upload d'un document"""
    id: str
    filename: str
    status: DocumentStatus
    message: str = "Document en cours de traitement"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "filename": "document.pdf",
                "status": "processing",
                "message": "Document en cours de traitement"
            }
        }
    )


class AIAnalysis(BaseModel):
    """Schéma pour l'analyse IA d'un document"""
    summary: Optional[str] = Field(None, description="Résumé du document")
    key_points: Optional[List[str]] = Field(default_factory=list, description="Points clés extraits")
    entities: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Entités détectées")
    language: Optional[str] = Field(None, description="Langue détectée")
    confidence: Optional[float] = Field(None, ge=0, le=1, description="Score de confiance")
    
    @field_validator('confidence')
    @classmethod
    def validate_confidence(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and not 0 <= v <= 1:
            raise ValueError('La confiance doit être entre 0 et 1')
        return v


class DocumentResponse(BaseModel):
    """Schéma complet d'un document"""
    id: str
    filename: str
    file_type: str
    file_size: int = Field(gt=0, description="Taille en octets")
    status: DocumentStatus
    user_id: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None
    extracted_text: Optional[str] = None
    ai_analysis: Optional[AIAnalysis] = None
    error_message: Optional[str] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "filename": "facture.pdf",
                "file_type": "pdf",
                "file_size": 245632,
                "status": "completed",
                "user_id": "user-123",
                "created_at": "2024-01-15T10:30:00",
                "processed_at": "2024-01-15T10:30:05",
                "extracted_text": "Facture N°2024-001...",
                "ai_analysis": {
                    "summary": "Facture de services informatiques",
                    "key_points": ["Montant: 1500€", "Date: 15/01/2024"],
                    "entities": [{"type": "money", "value": "1500€"}],
                    "language": "fr",
                    "confidence": 0.95
                }
            }
        }
    )


class DocumentListResponse(BaseModel):
    """Réponse pour une liste de documents"""
    documents: List[DocumentResponse]
    total: int
    limit: int
    offset: int
    has_more: bool

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "documents": [],
                "total": 25,
                "limit": 10,
                "offset": 0,
                "has_more": True
            }
        }
    )


class DocumentQueryParams(BaseModel):
    """Paramètres de requête pour lister les documents"""
    user_id: Optional[str] = None
    status: Optional[DocumentStatus] = None
    limit: int = Field(default=10, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
    sort_by: Literal["created_at", "processed_at", "filename"] = "created_at"
    order: Literal["asc", "desc"] = "desc"