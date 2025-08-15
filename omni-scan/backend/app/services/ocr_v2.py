"""
Service OCR v2 - Wrapper pour la nouvelle architecture modulaire
Maintient la compatibilité avec l'ancienne API
"""

from typing import Optional, Dict, Any
from pathlib import Path

from app.core.logging import get_logger
from app.services.ocr import get_ocr_manager, OCRConfig, OutputFormat

logger = get_logger("ocr_v2")


async def process_document(
    file_path: str,
    file_type: str,
    options: Optional[Dict[str, Any]] = None
) -> str:
    """
    Interface compatible avec l'ancien système.
    
    Args:
        file_path: Chemin du fichier
        file_type: Type de fichier (pdf, jpg, etc.)
        options: Options supplémentaires
        
    Returns:
        Texte extrait (string)
    """
    options = options or {}
    
    # Convertir les options vers OCRConfig
    config = OCRConfig(
        languages=options.get("languages", ["fra", "eng"]),
        enable_preprocessing=options.get("enable_preprocessing", True),
        enable_postprocessing=options.get("enable_postprocessing", True),
        output_format=OutputFormat.TEXT,
        use_gpu=options.get("use_gpu", False)
    )
    
    # Utiliser le gestionnaire OCR
    manager = get_ocr_manager()
    
    # Traiter le document
    result = await manager.process_document(
        file_path=file_path,
        file_type=file_type,
        engine_name=options.get("engine"),  # Permettre de forcer un moteur
        config=config
    )
    
    # Retourner uniquement le texte pour la compatibilité
    return result.text


async def process_document_advanced(
    file_path: str,
    file_type: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Interface avancée retournant toutes les informations.
    
    Returns:
        Dict avec toutes les informations extraites
    """
    options = options or {}
    
    # Convertir les options vers OCRConfig
    output_format = OutputFormat(options.get("output_format", "text"))
    
    config = OCRConfig(
        languages=options.get("languages", ["fra", "eng"]),
        enable_preprocessing=options.get("enable_preprocessing", True),
        enable_postprocessing=options.get("enable_postprocessing", True),
        output_format=output_format,
        extract_tables=options.get("extract_tables", False),
        extract_formulas=options.get("extract_formulas", False),
        use_gpu=options.get("use_gpu", False),
        regions=options.get("regions"),
        max_pages=options.get("max_pages")
    )
    
    # Utiliser le gestionnaire OCR
    manager = get_ocr_manager()
    
    # Traiter le document
    result = await manager.process_document(
        file_path=file_path,
        file_type=file_type,
        engine_name=options.get("engine"),
        config=config
    )
    
    # Construire la réponse
    response = {
        "text": result.text,
        "confidence": result.confidence,
        "processing_time": result.processing_time,
        "page_count": result.page_count,
        "language": result.language,
        "warnings": result.warnings
    }
    
    # Ajouter le format demandé
    if output_format != OutputFormat.TEXT:
        response[output_format.value] = result.to_format(output_format)
    
    # Ajouter les éléments extraits si présents
    if result.tables:
        response["tables"] = [
            {
                "headers": table.headers,
                "rows": table.rows
            }
            for table in result.tables
        ]
    
    if result.formulas:
        response["formulas"] = [
            {
                "latex": formula.latex,
                "text": formula.text
            }
            for formula in result.formulas
        ]
    
    # Informations sur le moteur utilisé
    engines_info = await get_engine_info()
    response["engine_used"] = engines_info.get("default_engine", "unknown")
    
    return response


async def get_engine_info() -> Dict[str, Any]:
    """Obtenir les informations sur les moteurs OCR disponibles"""
    manager = get_ocr_manager()
    await manager.initialize()
    
    return {
        "engines": manager.get_available_engines(),
        "default_engine": manager.default_engine,
        "supported_features": [f.value for f in manager.get_supported_features()],
        "supported_languages": manager.get_supported_languages()[:20]  # Top 20
    }


async def analyze_document_quality(file_path: str) -> Dict[str, Any]:
    """
    Analyser la qualité d'un document pour l'OCR.
    Compatible avec l'ancienne API.
    """
    # Pour l'instant, utiliser l'ancienne implémentation
    from app.services.ocr_unified import default_ocr_service
    return await default_ocr_service.analyze_document_quality(file_path)


# Alias pour la migration progressive
extract_text_from_file = process_document
process_ocr = process_document