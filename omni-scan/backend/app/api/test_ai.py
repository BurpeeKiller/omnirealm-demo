"""Endpoint de test pour l'IA"""

from fastapi import APIRouter, Header
from typing import Optional
import os
from app.services.ai_analysis_multi import AIAnalyzer, AIProvider
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
    
    # Configurer temporairement la clé
    original_key = None
    key_name = f"{provider.upper()}_API_KEY"
    if provider == "openrouter":
        key_name = "OPENROUTER_API_KEY"
    
    if x_ai_key:
        original_key = os.environ.get(key_name)
        os.environ[key_name] = x_ai_key
        logger.info(f"Testing {provider} with provided key")
    
    try:
        provider_enum = AIProvider[provider.upper()]
        analyzer = AIAnalyzer(provider=provider_enum)
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
    finally:
        # Restaurer
        if x_ai_key:
            if original_key is not None:
                os.environ[key_name] = original_key
            else:
                os.environ.pop(key_name, None)