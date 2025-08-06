"""Upload and OCR processing endpoints"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, status, Query
from typing import Optional
import os
import uuid
from datetime import datetime, timezone

from app.core.config import settings
from app.services.ocr import process_document
from app.services.ai_analysis import analyze_text
from app.core.database import get_supabase
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentResponse,
    DocumentListResponse,
    DocumentStatus
)
from app.core.logging import get_logger, APIErrorLogger
from app.core.validators import validate_file_extension, validate_file_size, sanitize_filename

router = APIRouter()

# Initialiser le logger et l'assistant d'erreurs
logger = get_logger("api.upload")
error_logger = APIErrorLogger(logger)


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: Optional[str] = Query(None, description="ID de l'utilisateur"),
    language: Optional[str] = Query(None, description="Code langue ISO (fr, en, es...)")
):
    """Upload et traitement d'un document"""
    
    # Log de la requête d'upload
    logger.info(
        "Document upload started",
        extra={
            "user_id": user_id,
            "file_name": file.filename,
            "content_type": file.content_type
        }
    )
    
    # Vérifier le quota utilisateur si connecté
    if user_id:
        supabase = get_supabase()
        if supabase:
            try:
                # Récupérer le profil utilisateur
                user_response = supabase.table("user_profiles").select("*").eq("id", user_id).execute()
                if user_response.data:
                    user_profile = user_response.data[0]
                    documents_used = user_profile.get("documents_used", 0)
                    documents_quota = user_profile.get("documents_quota", 5)
                    
                    if documents_used >= documents_quota:
                        error_logger.log_quota_exceeded(user_id, documents_used, documents_quota)
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN,
                            detail="Quota de documents atteint. Passez au plan Pro pour continuer."
                        )
            except HTTPException:
                raise
            except Exception as e:
                logger.error(
                    "Failed to check user quota",
                    extra={"user_id": user_id, "error": str(e)}
                )
                # Continuer sans vérification en cas d'erreur
    
    # Vérifier et nettoyer le nom de fichier
    if not file.filename:
        error_logger.log_validation_error(
            "/upload",
            {"field": "filename", "error": "missing"},
            user_id
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nom de fichier manquant"
        )
    
    # Nettoyer le nom de fichier
    clean_filename = sanitize_filename(file.filename)
    
    # Valider l'extension
    try:
        file_ext = validate_file_extension(clean_filename, settings.allowed_extensions)
    except ValueError as e:
        error_logger.log_validation_error(
            "/upload",
            {"field": "file_extension", "error": str(e), "file_name": file.filename},
            user_id
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format non supporté. Formats acceptés: {', '.join(settings.allowed_extensions)}"
        )
    
    # Lire et valider la taille du fichier
    contents = await file.read()
    file_size = len(contents)
    
    try:
        validate_file_size(file_size, settings.max_file_size_mb)
    except ValueError as e:
        error_logger.log_validation_error(
            "/upload",
            {"field": "file_size", "error": str(e), "size": file_size},
            user_id
        )
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Fichier trop volumineux. Maximum: {settings.max_file_size_mb}MB"
        )
    
    # Sauvegarder le fichier
    file_id = str(uuid.uuid4())
    file_path = os.path.join(settings.upload_path, f"{file_id}.{file_ext}")
    
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
        logger.debug(
            "File saved successfully",
            extra={"file_id": file_id, "path": file_path, "size": file_size}
        )
    except Exception as e:
        logger.error(
            "Failed to save file",
            extra={"file_id": file_id, "error": str(e)}
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la sauvegarde du fichier"
        )
    
    # Créer l'entrée en base
    supabase = get_supabase()
    document_data = {
        "id": file_id,
        "filename": clean_filename,  # Utiliser le nom nettoyé
        "file_type": file_ext,
        "file_size": file_size,
        "status": "processing",
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    if supabase:
        try:
            supabase.table("documents").insert(document_data).execute()
            logger.info(
                "Document record created",
                extra={"document_id": file_id, "user_id": user_id}
            )
        except Exception as e:
            error_logger.log_external_service_error("supabase", str(e), file_id)
            # Nettoyer le fichier en cas d'erreur DB
            try:
                os.remove(file_path)
            except Exception:
                pass
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'enregistrement du document"
            )
    else:
        # Mode test sans base de données
        logger.warning(
            "Supabase unavailable, skipping database insert",
            extra={"document_id": file_id}
        )
    
    # Traiter en arrière-plan
    background_tasks.add_task(
        process_document_async,
        file_id,
        file_path,
        file_ext,
        user_id,
        language
    )
    
    logger.info(
        "Document upload accepted",
        extra={
            "document_id": file_id,
            "user_id": user_id,
            "file_name": clean_filename,
            "size": file_size
        }
    )
    
    return DocumentUploadResponse(
        id=file_id,
        filename=clean_filename,
        status=DocumentStatus.PROCESSING,
        message="Document en cours de traitement"
    )


async def process_document_async(file_id: str, file_path: str, file_type: str, user_id: Optional[str] = None, language_hint: Optional[str] = None):
    """Traitement asynchrone du document"""
    logger.info(
        "Document processing started",
        extra={"document_id": file_id, "file_type": file_type}
    )
    
    try:
        # OCR
        logger.debug(f"Starting OCR for document {file_id}")
        text = await process_document(file_path, file_type)
        logger.debug(f"OCR completed for document {file_id}, extracted {len(text)} characters")
        
        # Analyse IA
        logger.debug(f"Starting AI analysis for document {file_id} with language hint: {language_hint}")
        analysis = await analyze_text(text, language_hint)
        logger.debug(f"AI analysis completed for document {file_id}")
        
        # Mettre à jour en base
        supabase = get_supabase()
        supabase.table("documents").update({
            "status": "completed",
            "extracted_text": text,
            "ai_analysis": analysis,
            "processed_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", file_id).execute()
        
        logger.info(
            "Document processing completed",
            extra={
                "document_id": file_id,
                "text_length": len(text),
                "has_analysis": bool(analysis)
            }
        )
        
        # Incrémenter le compteur de documents utilisés
        if user_id:
            try:
                # Récupérer le nombre actuel
                user_response = supabase.table("user_profiles").select("documents_used").eq("id", user_id).execute()
                if user_response.data:
                    current_used = user_response.data[0].get("documents_used", 0)
                    # Incrémenter
                    supabase.table("user_profiles").update({
                        "documents_used": current_used + 1
                    }).eq("id", user_id).execute()
                    
                    logger.info(
                        "User quota updated",
                        extra={
                            "user_id": user_id,
                            "documents_used": current_used + 1
                        }
                    )
            except Exception as e:
                logger.warning(
                    "Failed to update user quota",
                    extra={"user_id": user_id, "error": str(e)}
                )
        
    except Exception as e:
        # Déterminer le stade de l'erreur
        if 'OCR' in str(e) or 'process_document' in str(e):
            stage = "ocr"
        elif 'AI' in str(e) or 'analyze_text' in str(e):
            stage = "ai_analysis"
        else:
            stage = "processing"
        
        error_logger.log_processing_error(file_id, str(e), stage)
        
        # Mettre à jour le statut d'erreur
        try:
            supabase = get_supabase()
            supabase.table("documents").update({
                "status": "error",
                "error_message": str(e),
                "error_stage": stage
            }).eq("id", file_id).execute()
        except Exception as db_error:
            logger.error(
                "Failed to update error status",
                extra={"document_id": file_id, "error": str(db_error)}
            )
    
    finally:
        # Nettoyer le fichier temporaire après traitement
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.debug(f"Temporary file removed: {file_path}")
        except Exception as e:
            logger.warning(
                "Failed to remove temporary file",
                extra={"file_path": file_path, "error": str(e)}
            )


@router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Récupérer les détails d'un document avec validation"""
    logger.debug(f"Getting document {document_id}")
    
    try:
        supabase = get_supabase()
        response = supabase.table("documents").select("*").eq("id", document_id).execute()
        
        if not response.data:
            logger.warning(
                "Document not found",
                extra={"document_id": document_id}
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Document non trouvé"
            )
        
        # Convertir en modèle Pydantic
        doc_data = response.data[0]
        document = DocumentResponse(**doc_data)
        
        logger.info(
            "Document retrieved",
            extra={
                "document_id": document_id,
                "status": document.status,
                "user_id": doc_data.get("user_id")
            }
        )
        
        return document
    except HTTPException:
        raise
    except Exception as e:
        error_logger.log_external_service_error("supabase", str(e), document_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération du document"
        )


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents(
    user_id: Optional[str] = Query(None, description="Filtrer par utilisateur"),
    status: Optional[DocumentStatus] = Query(None, description="Filtrer par statut"),
    limit: int = Query(10, ge=1, le=100, description="Nombre de documents à retourner"),
    offset: int = Query(0, ge=0, description="Nombre de documents à ignorer"),
    sort_by: str = Query("created_at", description="Champ de tri"),
    order: str = Query("desc", description="Ordre de tri (asc ou desc)")
):
    """Lister les documents avec pagination et filtres"""
    logger.info(
        "Listing documents",
        extra={
            "user_id": user_id,
            "status": status.value if status else None,
            "limit": limit,
            "offset": offset
        }
    )
    
    try:
        supabase = get_supabase()
        
        # Construire la requête
        query = supabase.table("documents").select("*", count="exact")
        
        # Appliquer les filtres
        if user_id:
            query = query.eq("user_id", user_id)
        if status:
            query = query.eq("status", status.value)
        
        # Tri
        query = query.order(sort_by, desc=(order == "desc"))
        
        # Pagination
        query = query.range(offset, offset + limit - 1)
        
        # Exécuter la requête
        response = query.execute()
        
        # Convertir les documents
        documents = [DocumentResponse(**doc) for doc in response.data]
        
        # Calculer les métadonnées de pagination
        total = response.count if response.count else len(documents)
        has_more = total > offset + limit
        
        logger.info(
            "Documents listed successfully",
            extra={
                "count": len(documents),
                "total": total,
                "has_more": has_more
            }
        )
        
        return DocumentListResponse(
            documents=documents,
            total=total,
            limit=limit,
            offset=offset,
            has_more=has_more
        )
        
    except Exception as e:
        error_logger.log_external_service_error("supabase", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des documents"
        )