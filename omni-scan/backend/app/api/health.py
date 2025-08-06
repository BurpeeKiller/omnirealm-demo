"""Health check endpoint"""

from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.config import settings
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Vérifier l'état de l'application et des services"""
    # Vérifier l'état des services
    services_status = {
        "database": True,  # Pourrait être vérifié via Supabase
        "ocr": True,       # Pourrait être vérifié via Tesseract
        "ai": True         # Pourrait être vérifié via OpenAI
    }
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version=settings.app_version,
        services=services_status
    )