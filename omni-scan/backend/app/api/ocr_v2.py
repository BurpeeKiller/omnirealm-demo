"""
API OCR v2 - Endpoints pour le nouveau système OCR modulaire
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Header, Form, Depends
from typing import Optional, List, Dict, Any
import json

from app.core.logging import get_logger
from app.services.ocr_v2 import process_document_advanced, get_engine_info
from app.services.ocr import OutputFormat, OCRFeature
from app.api.dependencies import get_current_user_optional
from app.core.validators import validate_file_extension, validate_file_size
from app.core.config import settings
import tempfile
import os

router = APIRouter()
logger = get_logger("api.ocr_v2")


@router.get("/ocr/engines", status_code=status.HTTP_200_OK)
async def get_ocr_engines():
    """
    Obtenir la liste des moteurs OCR disponibles et leurs capacités.
    """
    try:
        info = await get_engine_info()
        return {
            "success": True,
            "data": info
        }
    except Exception as e:
        logger.error(f"Error getting OCR engines: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des moteurs OCR"
        )


@router.post("/ocr/process", status_code=status.HTTP_200_OK)
async def process_document_ocr(
    file: UploadFile = File(...),
    engine: Optional[str] = Form(None),
    output_format: Optional[str] = Form("text"),
    languages: Optional[str] = Form("fra,eng"),
    extract_tables: Optional[bool] = Form(False),
    extract_formulas: Optional[bool] = Form(False),
    enable_preprocessing: Optional[bool] = Form(True),
    enable_postprocessing: Optional[bool] = Form(True),
    regions: Optional[str] = Form(None),  # JSON string pour les régions
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Traiter un document avec OCR avancé.
    
    Args:
        file: Fichier à traiter
        engine: Moteur OCR à utiliser (tesseract, got-ocr2, trocr)
        output_format: Format de sortie (text, markdown, json, latex, html, csv)
        languages: Langues pour l'OCR (comma-separated)
        extract_tables: Extraire les tableaux
        extract_formulas: Extraire les formules mathématiques
        enable_preprocessing: Activer le prétraitement d'image
        enable_postprocessing: Activer le post-traitement du texte
        regions: Zones d'intérêt (format JSON)
    """
    logger.info(f"OCR v2 processing: {file.filename}, engine: {engine}, format: {output_format}")
    
    # Validation du fichier
    try:
        file_ext = validate_file_extension(file.filename, settings.allowed_extensions)
        contents = await file.read()
        validate_file_size(len(contents), settings.max_file_size_mb)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Parser les régions si fournies
    regions_list = None
    if regions:
        try:
            regions_data = json.loads(regions)
            regions_list = regions_data if isinstance(regions_data, list) else None
        except json.JSONDecodeError:
            logger.warning(f"Invalid regions JSON: {regions}")
    
    # Sauvegarder temporairement le fichier
    with tempfile.NamedTemporaryFile(suffix=f".{file_ext}", delete=False) as tmp_file:
        tmp_file.write(contents)
        temp_path = tmp_file.name
    
    try:
        # Options pour l'OCR
        options = {
            "engine": engine,
            "output_format": output_format,
            "languages": languages.split(",") if languages else ["fra", "eng"],
            "extract_tables": extract_tables,
            "extract_formulas": extract_formulas,
            "enable_preprocessing": enable_preprocessing,
            "enable_postprocessing": enable_postprocessing,
            "regions": regions_list,
            "use_gpu": os.getenv("ENABLE_GPU", "false").lower() == "true"
        }
        
        # Traiter le document
        result = await process_document_advanced(
            file_path=temp_path,
            file_type=file_ext,
            options=options
        )
        
        # Ajouter des métadonnées
        result["filename"] = file.filename
        result["file_size"] = len(contents)
        
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        logger.error(f"OCR processing error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement OCR: {str(e)}"
        )
    finally:
        # Nettoyer le fichier temporaire
        if os.path.exists(temp_path):
            os.unlink(temp_path)


@router.post("/ocr/extract-table", status_code=status.HTTP_200_OK)
async def extract_table_from_document(
    file: UploadFile = File(...),
    format: Optional[str] = Form("csv"),
    engine: Optional[str] = Form(None),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Extraire spécifiquement les tableaux d'un document.
    
    Args:
        file: Fichier contenant des tableaux
        format: Format de sortie (csv, json, excel)
        engine: Moteur OCR à utiliser
    """
    logger.info(f"Table extraction: {file.filename}")
    
    # Validation
    try:
        file_ext = validate_file_extension(file.filename, settings.allowed_extensions)
        contents = await file.read()
        validate_file_size(len(contents), settings.max_file_size_mb)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Sauvegarder temporairement
    with tempfile.NamedTemporaryFile(suffix=f".{file_ext}", delete=False) as tmp_file:
        tmp_file.write(contents)
        temp_path = tmp_file.name
    
    try:
        # Options spécifiques pour extraction de tableaux
        options = {
            "engine": engine,
            "output_format": "json",  # Pour récupérer les données structurées
            "extract_tables": True,
            "extract_formulas": False,
            "enable_preprocessing": True,
            "enable_postprocessing": True
        }
        
        # Traiter
        result = await process_document_advanced(
            file_path=temp_path,
            file_type=file_ext,
            options=options
        )
        
        # Extraire les tableaux
        tables = result.get("tables", [])
        
        if not tables:
            return {
                "success": True,
                "message": "Aucun tableau détecté dans le document",
                "data": {
                    "tables": [],
                    "count": 0
                }
            }
        
        # Formater selon le format demandé
        if format == "csv" and tables:
            # Retourner le premier tableau en CSV
            first_table = tables[0]
            csv_content = result.get("csv", "")
            return {
                "success": True,
                "data": {
                    "format": "csv",
                    "content": csv_content,
                    "table_count": len(tables)
                }
            }
        else:
            # Retourner tous les tableaux en JSON
            return {
                "success": True,
                "data": {
                    "format": "json",
                    "tables": tables,
                    "count": len(tables)
                }
            }
            
    except Exception as e:
        logger.error(f"Table extraction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'extraction des tableaux: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


@router.post("/ocr/extract-formulas", status_code=status.HTTP_200_OK)
async def extract_formulas_from_document(
    file: UploadFile = File(...),
    format: Optional[str] = Form("latex"),
    engine: Optional[str] = Form(None),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Extraire les formules mathématiques d'un document.
    
    Args:
        file: Fichier contenant des formules
        format: Format de sortie (latex, mathml, text)
        engine: Moteur OCR à utiliser
    """
    logger.info(f"Formula extraction: {file.filename}")
    
    # Validation
    try:
        file_ext = validate_file_extension(file.filename, settings.allowed_extensions)
        contents = await file.read()
        validate_file_size(len(contents), settings.max_file_size_mb)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Sauvegarder temporairement
    with tempfile.NamedTemporaryFile(suffix=f".{file_ext}", delete=False) as tmp_file:
        tmp_file.write(contents)
        temp_path = tmp_file.name
    
    try:
        # Options pour extraction de formules
        options = {
            "engine": engine or "got-ocr2",  # GOT-OCR2 est meilleur pour les formules
            "output_format": "latex",
            "extract_tables": False,
            "extract_formulas": True,
            "enable_preprocessing": True,
            "enable_postprocessing": True
        }
        
        # Traiter
        result = await process_document_advanced(
            file_path=temp_path,
            file_type=file_ext,
            options=options
        )
        
        # Extraire les formules
        formulas = result.get("formulas", [])
        
        if not formulas:
            return {
                "success": True,
                "message": "Aucune formule mathématique détectée",
                "data": {
                    "formulas": [],
                    "count": 0
                }
            }
        
        # Formater selon le format demandé
        formatted_formulas = []
        for formula in formulas:
            if format == "latex":
                formatted_formulas.append(formula.get("latex", ""))
            elif format == "text":
                formatted_formulas.append(formula.get("text", ""))
            else:
                formatted_formulas.append(formula)
        
        return {
            "success": True,
            "data": {
                "format": format,
                "formulas": formatted_formulas,
                "count": len(formulas),
                "full_latex": result.get("latex", "")
            }
        }
        
    except Exception as e:
        logger.error(f"Formula extraction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'extraction des formules: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


@router.get("/ocr/supported-features", status_code=status.HTTP_200_OK)
async def get_supported_features():
    """
    Obtenir la liste des fonctionnalités OCR supportées.
    """
    try:
        info = await get_engine_info()
        
        # Compiler toutes les fonctionnalités
        all_features = set()
        for engine_info in info.get("engines", {}).values():
            all_features.update(engine_info.get("features", []))
        
        # Créer une description pour chaque fonctionnalité
        feature_descriptions = {
            OCRFeature.BASIC_TEXT.value: "Extraction de texte basique",
            OCRFeature.TABLES.value: "Extraction et structuration de tableaux",
            OCRFeature.FORMULAS.value: "Reconnaissance de formules mathématiques",
            OCRFeature.HANDWRITING.value: "Reconnaissance d'écriture manuscrite",
            OCRFeature.DIAGRAMS.value: "Extraction de diagrammes et schémas",
            OCRFeature.MUSIC_SHEETS.value: "Reconnaissance de partitions musicales",
            OCRFeature.INTERACTIVE.value: "Sélection interactive de zones",
            OCRFeature.BATCH.value: "Traitement par lot de plusieurs fichiers",
            OCRFeature.MULTILINGUAL.value: "Support multilingue"
        }
        
        features = []
        for feature in all_features:
            features.append({
                "id": feature,
                "name": feature.replace("_", " ").title(),
                "description": feature_descriptions.get(feature, ""),
                "available": True
            })
        
        return {
            "success": True,
            "data": {
                "features": features,
                "count": len(features)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting features: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des fonctionnalités"
        )