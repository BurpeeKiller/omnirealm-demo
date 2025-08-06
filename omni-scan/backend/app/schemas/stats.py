"""Schémas Pydantic pour les statistiques"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, List, Optional
from datetime import datetime, date


class UserStats(BaseModel):
    """Statistiques d'un utilisateur"""
    user_id: str
    total_documents: int = Field(ge=0)
    documents_used: int = Field(ge=0)
    documents_quota: int = Field(ge=0)
    usage_percentage: float = Field(ge=0, le=100)
    subscription_tier: str = "free"
    last_upload: Optional[datetime] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": "user-123",
                "total_documents": 15,
                "documents_used": 3,
                "documents_quota": 5,
                "usage_percentage": 60.0,
                "subscription_tier": "free",
                "last_upload": "2024-01-15T10:30:00"
            }
        }
    )


class DocumentStats(BaseModel):
    """Statistiques sur les documents"""
    total_count: int = Field(ge=0)
    by_status: Dict[str, int]
    by_type: Dict[str, int]
    average_processing_time: Optional[float] = Field(None, ge=0, description="Temps moyen en secondes")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_count": 150,
                "by_status": {
                    "completed": 140,
                    "processing": 5,
                    "error": 5
                },
                "by_type": {
                    "pdf": 100,
                    "jpg": 30,
                    "png": 20
                },
                "average_processing_time": 3.5
            }
        }
    )


class DailyStats(BaseModel):
    """Statistiques journalières"""
    date: date
    uploads: int = Field(ge=0)
    successful: int = Field(ge=0)
    failed: int = Field(ge=0)
    unique_users: int = Field(ge=0)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "date": "2024-01-15",
                "uploads": 45,
                "successful": 42,
                "failed": 3,
                "unique_users": 12
            }
        }
    )


class GlobalStats(BaseModel):
    """Statistiques globales du système"""
    total_users: int = Field(ge=0)
    active_users_today: int = Field(ge=0)
    active_users_week: int = Field(ge=0)
    active_users_month: int = Field(ge=0)
    document_stats: DocumentStats
    daily_stats: List[DailyStats] = Field(default_factory=list)
    system_health: Dict[str, bool]
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_users": 250,
                "active_users_today": 45,
                "active_users_week": 120,
                "active_users_month": 200,
                "document_stats": {
                    "total_count": 1500,
                    "by_status": {"completed": 1450, "processing": 10, "error": 40},
                    "by_type": {"pdf": 1000, "jpg": 300, "png": 200},
                    "average_processing_time": 3.2
                },
                "daily_stats": [],
                "system_health": {
                    "database": True,
                    "ocr_service": True,
                    "ai_service": True,
                    "storage": True
                }
            }
        }
    )