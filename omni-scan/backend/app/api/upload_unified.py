"""
API d'upload unifiée
Remplace upload.py et upload_simple.py
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Header, Form, Depends, BackgroundTasks
from typing import Optional, List

from app.core.logging import get_logger
from app.services.upload_unified import UnifiedUploadService, UploadMode, UploadConfig
from app.services.ai_analysis_unified import AIProvider
from app.api.dependencies import get_current_user_optional, get_current_user
from app.services.job_manager import job_manager, JobType

router = APIRouter()
logger = get_logger("api.upload_unified")


@router.post("/upload", status_code=status.HTTP_200_OK)
async def upload_document(
    file: UploadFile = File(...),
    x_ai_provider: Optional[str] = Header(None),
    x_ai_key: Optional[str] = Header(None),
    detail_level: Optional[str] = Form("medium"),
    language: Optional[str] = Form(None),
    include_structured_data: Optional[bool] = Form(True),
    chapter_summaries: Optional[bool] = Form(False),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Upload et traitement de document (mode adaptatif).
    
    - Si authentifié : stockage complet avec historique
    - Si non authentifié : mode simple sans stockage
    """
    logger.info(f"Document upload: {file.filename}, authenticated: {bool(current_user)}")
    
    # Déterminer le mode selon l'authentification
    if current_user:
        # Mode complet avec stockage
        config = UploadConfig(
            mode=UploadMode.FULL,
            store_files=True,
            store_results=True,
            require_auth=True,
            check_quota=True
        )
        user_id = current_user.get("id")
    else:
        # Mode simple sans stockage
        config = UploadConfig(
            mode=UploadMode.SIMPLE,
            store_files=False,
            store_results=False,
            require_auth=False,
            check_quota=False
        )
        user_id = None
    
    # Service d'upload
    upload_service = UnifiedUploadService(config)
    
    # Lire le fichier
    contents = await file.read()
    
    # Options pour le traitement
    options = {
        "ai_provider": x_ai_provider or "openai",
        "api_key": x_ai_key,
        "detail_level": detail_level,
        "language": language,
        "include_structured_data": include_structured_data,
        "chapter_summaries": chapter_summaries
    }
    
    try:
        # Traiter l'upload
        result = await upload_service.process_upload(
            file_content=contents,
            filename=file.filename,
            user_id=user_id,
            options=options
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Upload error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement: {str(e)}"
        )


async def process_upload_background(
    job_id: str,
    file_content: bytes,
    filename: str,
    options: dict
):
    """
    Traite l'upload en arrière-plan et met à jour le job.
    """
    job = job_manager.get_job(job_id)
    if not job:
        logger.error(f"Job {job_id} not found")
        return
    
    try:
        # Démarrer le job
        job.start()
        job_manager.update_job_progress(job_id, 0, "Initialisation du traitement...")
        
        # Config simple sans stockage
        config = UploadConfig(
            mode=UploadMode.SIMPLE,
            store_files=False,
            store_results=False,
            require_auth=False,
            check_quota=False
        )
        
        # Service d'upload avec callback de progression
        upload_service = UnifiedUploadService(config)
        
        # Callback pour mettre à jour la progression
        def progress_callback(current: int, total: int, message: str):
            job_manager.update_job_progress(job_id, current, message)
        
        # Injecter le callback dans le service
        upload_service._progress_callback = progress_callback
        
        # Traiter l'upload
        result = await upload_service.process_upload(
            file_content=file_content,
            filename=filename,
            user_id=None,
            options=options
        )
        
        # Marquer comme terminé
        job_manager.complete_job(job_id, result)
        logger.info(f"Job {job_id} completed successfully")
        
    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}", exc_info=True)
        job_manager.fail_job(job_id, str(e))


@router.post("/upload/simple", status_code=status.HTTP_202_ACCEPTED)
async def upload_document_simple(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    x_ai_provider: Optional[str] = Header(None),
    x_ai_key: Optional[str] = Header(None),
    detail_level: Optional[str] = Form("medium"),
    language: Optional[str] = Form(None),
    include_structured_data: Optional[bool] = Form(True),
    chapter_summaries: Optional[bool] = Form(False)
):
    """
    Upload simple sans authentification ni stockage.
    Retourne immédiatement un job_id pour suivre la progression.
    """
    logger.info(f"Document upload: {file.filename}")
    
    # Lire le fichier
    contents = await file.read()
    
    # Créer un job - estimer le nombre d'étapes (dépend du type de fichier)
    estimated_steps = 10  # Par défaut
    if file.filename.lower().endswith('.pdf'):
        # Pour un PDF, on ne sait pas encore le nombre de pages
        estimated_steps = 100  # Estimation haute
    
    job = job_manager.create_job(JobType.UPLOAD, estimated_steps)
    job.metadata = {
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type
    }
    
    # Options pour le traitement
    options = {
        "ai_provider": x_ai_provider or "openai",
        "api_key": x_ai_key,
        "detail_level": detail_level,
        "language": language,
        "include_structured_data": include_structured_data,
        "chapter_summaries": chapter_summaries
    }
    
    # Lancer le traitement en arrière-plan
    background_tasks.add_task(
        process_upload_background,
        job.id,
        contents,
        file.filename,
        options
    )
    
    # Retourner immédiatement l'ID du job
    return {
        "job_id": job.id,
        "status": "pending",
        "message": "Traitement en cours...",
        "status_url": f"/api/v1/job/{job.id}/status"
    }


@router.post("/upload/batch", status_code=status.HTTP_200_OK)
async def upload_batch(
    files: List[UploadFile] = File(...),
    x_ai_provider: Optional[str] = Header(None),
    x_ai_key: Optional[str] = Header(None),
    detail_level: Optional[str] = Form("medium"),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload multiple de documents (authentification requise).
    """
    logger.info(f"Batch upload: {len(files)} files")
    
    # Config pour batch avec stockage
    config = UploadConfig(
        mode=UploadMode.BATCH,
        store_files=True,
        store_results=True,
        require_auth=True,
        check_quota=True
    )
    
    upload_service = UnifiedUploadService(config)
    
    # Préparer les fichiers
    file_list = []
    for file in files:
        contents = await file.read()
        file_list.append((file.filename, contents))
    
    # Options communes
    options = {
        "ai_provider": x_ai_provider or "openai",
        "api_key": x_ai_key,
        "detail_level": detail_level
    }
    
    try:
        # Traiter en lot
        results = await upload_service.process_batch(
            files=file_list,
            user_id=current_user.get("id"),
            options=options
        )
        
        return {
            "total": len(files),
            "successful": sum(1 for r in results if r.get("success", False)),
            "failed": sum(1 for r in results if not r.get("success", False)),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Batch upload error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement batch: {str(e)}"
        )


@router.get("/documents", status_code=status.HTTP_200_OK)
async def get_user_documents(
    current_user: dict = Depends(get_current_user),
    limit: int = 10,
    offset: int = 0
):
    """
    Récupérer l'historique des documents de l'utilisateur.
    """
    from app.core.database import get_supabase
    
    try:
        supabase = get_supabase()
        
        # Récupérer les documents de l'utilisateur
        response = supabase.table("documents")\
            .select("*")\
            .eq("user_id", current_user.get("id"))\
            .order("created_at", desc=True)\
            .limit(limit)\
            .offset(offset)\
            .execute()
        
        return {
            "documents": response.data,
            "total": len(response.data),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Error fetching documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des documents"
        )


@router.get("/documents/{document_id}", status_code=status.HTTP_200_OK)
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Récupérer un document spécifique.
    """
    from app.core.database import get_supabase
    
    try:
        supabase = get_supabase()
        
        # Récupérer le document
        response = supabase.table("documents")\
            .select("*")\
            .eq("id", document_id)\
            .eq("user_id", current_user.get("id"))\
            .single()\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document non trouvé"
            )
        
        return response.data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération du document"
        )


@router.get("/ai-providers", status_code=status.HTTP_200_OK)
async def get_ai_providers():
    """
    Obtenir la liste des providers AI disponibles.
    """
    providers = []
    
    for provider in AIProvider:
        providers.append({
            "id": provider.value,
            "name": provider.value.capitalize(),
            "requires_api_key": provider != AIProvider.OLLAMA
        })
    
    return {"providers": providers}


@router.get("/job/{job_id}/status", status_code=status.HTTP_200_OK)
async def get_job_status(job_id: str):
    """
    Récupérer le statut d'un job de traitement.
    """
    job = job_manager.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    return job.to_dict()