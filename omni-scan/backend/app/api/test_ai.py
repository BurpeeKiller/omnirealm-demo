"""Endpoint de test pour l'IA"""

from fastapi import APIRouter, Header
from typing import Optional
from app.services.ai_analysis_unified import AIAnalyzer, AIProvider, analyze_with_custom_key
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger("test_ai")

@router.post("/test-ai")
async def test_ai_provider(
    provider: str = "openai",
    x_ai_key: Optional[str] = Header(None)
):
    """Tester un provider d'IA avec un texte simple"""
    
    test_text = "Ceci est un test de l'analyse IA pour OmniScan. Le système doit analyser ce texte et retourner un résumé."
    
    try:
        provider_enum = AIProvider[provider.upper()]
        
        if x_ai_key:
            logger.info(f"Testing {provider} with provided key")
            # Utiliser la fonction helper sécurisée avec la clé personnalisée
            result = await analyze_with_custom_key(
                text=test_text,
                provider=provider_enum,
                api_key=x_ai_key,
                detail_level="medium"
            )
        else:
            # Utiliser l'analyseur standard avec les clés par défaut
            analyzer = AIAnalyzer(provider=provider_enum)
            async with analyzer:
                result = await analyzer.analyze_text(test_text)
        
        return {
            "success": True,
            "provider": provider,
            "key_provided": bool(x_ai_key),
            "analysis": result
        }
    except Exception as e:
        logger.error(f"Test AI error: {str(e)}")
        return {
            "success": False,
            "provider": provider,
            "key_provided": bool(x_ai_key),
            "error": str(e)
        }
