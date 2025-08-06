"""Version simplifiée sans base de données pour OmniScan"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Header, Form
import os
import uuid
from typing import Dict, Any, Optional

from app.core.config import settings
from app.services.ocr_simple import process_document
from app.services.ai_analysis_multi import AIAnalyzer, AIProvider
from app.core.logging import get_logger
from app.core.validators import validate_file_extension, validate_file_size, sanitize_filename

router = APIRouter()
logger = get_logger("api.upload_simple")

# Stockage en mémoire pour les documents en cours (redémarre à chaque restart)
processing_documents: Dict[str, Dict[str, Any]] = {}


@router.post("/upload/simple", status_code=status.HTTP_200_OK)
async def upload_document_simple(
    file: UploadFile = File(...),
    x_ai_provider: Optional[str] = Header(None),
    x_ai_key: Optional[str] = Header(None),
    detail_level: Optional[str] = Form("medium"),
    language: Optional[str] = Form(None),
    include_structured_data: Optional[bool] = Form(True)
):
    """
    Upload et traitement SANS base de données
    Retourne directement le résultat OCR + analyse
    """
    
    logger.info(f"Document upload (mode simple): {file.filename}")
    
    # Validation du fichier
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nom de fichier manquant"
        )
    
    clean_filename = sanitize_filename(file.filename)
    
    try:
        file_ext = validate_file_extension(clean_filename, settings.allowed_extensions)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format non supporté. Formats acceptés: {', '.join(settings.allowed_extensions)}"
        )
    
    # Lire et valider la taille
    contents = await file.read()
    file_size = len(contents)
    
    try:
        validate_file_size(file_size, settings.max_file_size_mb)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Fichier trop volumineux. Maximum: {settings.max_file_size_mb}MB"
        )
    
    # Sauvegarder temporairement
    file_id = str(uuid.uuid4())
    temp_path = os.path.join(settings.temp_path, f"{file_id}.{file_ext}")
    
    try:
        # Créer le dossier temp s'il n'existe pas
        os.makedirs(settings.temp_path, exist_ok=True)
        
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        # OCR immédiat
        logger.info(f"Starting OCR for {file_id}")
        extracted_text = await process_document(temp_path, file_ext)
        
        # Analyse IA immédiate avec le provider choisi
        # Utiliser la clé API du client si fournie
        ai_provider = x_ai_provider or "openai"
        logger.info(f"Starting AI analysis for {file_id} with {ai_provider}")
        logger.info(f"API key provided: {bool(x_ai_key)}, Provider: {ai_provider}")
        
        # Configurer temporairement la clé API si fournie
        original_key = None
        if x_ai_key:
            if ai_provider == "openai":
                original_key = os.environ.get("OPENAI_API_KEY")
                os.environ["OPENAI_API_KEY"] = x_ai_key
            elif ai_provider == "groq":
                original_key = os.environ.get("GROQ_API_KEY")
                os.environ["GROQ_API_KEY"] = x_ai_key
            elif ai_provider == "anthropic":
                original_key = os.environ.get("ANTHROPIC_API_KEY")
                os.environ["ANTHROPIC_API_KEY"] = x_ai_key
            elif ai_provider == "openrouter":
                original_key = os.environ.get("OPENROUTER_API_KEY")
                os.environ["OPENROUTER_API_KEY"] = x_ai_key
        
        try:
            # Créer l'analyseur avec le bon provider
            provider_enum = AIProvider[ai_provider.upper()]
            analyzer = AIAnalyzer(provider=provider_enum)
            ai_analysis = await analyzer.analyze_text(
                extracted_text, 
                detail_level=detail_level,
                language=language,
                include_structured_data=include_structured_data
            )
        finally:
            # Restaurer la clé originale ou supprimer si elle n'existait pas
            if x_ai_key:
                if ai_provider == "openai":
                    if original_key is not None:
                        os.environ["OPENAI_API_KEY"] = original_key
                    else:
                        os.environ.pop("OPENAI_API_KEY", None)
                elif ai_provider == "groq":
                    if original_key is not None:
                        os.environ["GROQ_API_KEY"] = original_key
                    else:
                        os.environ.pop("GROQ_API_KEY", None)
                elif ai_provider == "anthropic":
                    if original_key is not None:
                        os.environ["ANTHROPIC_API_KEY"] = original_key
                    else:
                        os.environ.pop("ANTHROPIC_API_KEY", None)
                elif ai_provider == "openrouter":
                    if original_key is not None:
                        os.environ["OPENROUTER_API_KEY"] = original_key
                    else:
                        os.environ.pop("OPENROUTER_API_KEY", None)
        
        # Nettoyer le fichier temporaire
        os.remove(temp_path)
        
        # Retourner le résultat directement
        return {
            "success": True,
            "filename": clean_filename,
            "extracted_text": extracted_text,
            "ai_analysis": ai_analysis,
            "text_length": len(extracted_text),
            "processing_time": "Immédiat"
        }
        
    except Exception as e:
        # Nettoyer en cas d'erreur
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        logger.error(f"Erreur traitement: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement: {str(e)}"
        )


@router.get("/simple/health")
async def health_check():
    """Vérifier que le mode simple fonctionne"""
    return {
        "status": "ok",
        "mode": "simple (sans base de données)",
        "features": {
            "ocr": True,
            "ai_analysis": True,
            "storage": False,
            "history": False,
            "user_management": False
        }
    }