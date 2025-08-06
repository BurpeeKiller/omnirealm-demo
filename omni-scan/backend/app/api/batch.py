"""API endpoints pour le traitement par batch"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from typing import List
import uuid
import os
import asyncio
from datetime import datetime

from app.core.database import get_supabase
from app.core.config import settings
from app.api.auth import get_current_user
from app.services.ocr import process_document
from app.core.validators import validate_file

router = APIRouter()


@router.post("/batch/upload")
async def upload_batch(
    files: List[UploadFile] = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user = Depends(get_current_user)
):
    """
    Upload et traiter plusieurs fichiers en batch
    
    - Maximum 10 fichiers par batch (limite free)
    - Maximum 50 fichiers par batch (limite pro)
    """
    # Vérifier les limites
    max_files = 50 if current_user.get("is_premium", False) else 10
    if len(files) > max_files:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {max_files} fichiers par batch"
        )
    
    batch_id = str(uuid.uuid4())
    batch_results = []
    
    for file in files:
        try:
            # Valider le fichier
            validate_file(file)
            
            # Générer un nom unique
            file_id = str(uuid.uuid4())
            file_extension = file.filename.split('.')[-1].lower()
            file_path = os.path.join(settings.upload_path, f"{file_id}.{file_extension}")
            
            # Sauvegarder le fichier
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Créer l'entrée en base
            document = Document(
                id=file_id,
                user_id=current_user["id"],
                filename=file.filename,
                file_path=file_path,
                file_type=file_extension,
                file_size=len(content)
            )
            db.add(document)
            
            batch_results.append({
                "document_id": file_id,
                "filename": file.filename,
                "status": "queued",
                "batch_id": batch_id
            })
            
            # Ajouter la tâche de traitement OCR en arrière-plan
            background_tasks.add_task(
                process_document_async,
                document_id=file_id,
                file_path=file_path,
                file_type=file_extension,
                db=db
            )
            
        except Exception as e:
            batch_results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e),
                "batch_id": batch_id
            })
    
    db.commit()
    
    return {
        "batch_id": batch_id,
        "total_files": len(files),
        "queued": len([r for r in batch_results if r["status"] == "queued"]),
        "errors": len([r for r in batch_results if r["status"] == "error"]),
        "results": batch_results
    }


@router.get("/batch/{batch_id}/status")
async def get_batch_status(
    batch_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtenir le statut d'un batch de documents
    """
    # Récupérer tous les documents du batch
    # Note: Dans une vraie app, on aurait une table BatchJob
    # Pour simplifier, on utilise les documents directement
    
    documents = db.query(Document).filter(
        Document.user_id == current_user["id"],
        # Filtrer par batch_id si on avait ce champ
    ).all()
    
    if not documents:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    results = []
    for doc in documents:
        status = "completed" if doc.ocr_text else "processing"
        results.append({
            "document_id": doc.id,
            "filename": doc.filename,
            "status": status,
            "ocr_completed": bool(doc.ocr_text),
            "ai_completed": bool(doc.ai_analysis)
        })
    
    completed = len([r for r in results if r["status"] == "completed"])
    
    return {
        "batch_id": batch_id,
        "total_documents": len(results),
        "completed": completed,
        "processing": len(results) - completed,
        "progress_percentage": round((completed / len(results)) * 100) if results else 0,
        "documents": results
    }


@router.post("/batch/process-folder")
async def process_folder_batch(
    folder_path: str,
    recursive: bool = False,
    file_types: List[str] = ["pdf", "jpg", "jpeg", "png"],
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Traiter tous les fichiers d'un dossier (fonctionnalité Pro)
    """
    if not current_user.get("is_premium", False):
        raise HTTPException(
            status_code=403,
            detail="Cette fonctionnalité nécessite un compte Pro"
        )
    
    # Vérifier que le dossier existe
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail="Dossier invalide")
    
    # Collecter les fichiers
    files_to_process = []
    
    if recursive:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if any(file.lower().endswith(f".{ft}") for ft in file_types):
                    files_to_process.append(os.path.join(root, file))
    else:
        for file in os.listdir(folder_path):
            if any(file.lower().endswith(f".{ft}") for ft in file_types):
                files_to_process.append(os.path.join(folder_path, file))
    
    # Limiter à 100 fichiers
    if len(files_to_process) > 100:
        files_to_process = files_to_process[:100]
    
    batch_id = str(uuid.uuid4())
    batch_results = []
    
    for file_path in files_to_process:
        try:
            file_id = str(uuid.uuid4())
            file_extension = file_path.split('.')[-1].lower()
            filename = os.path.basename(file_path)
            file_size = os.path.getsize(file_path)
            
            # Copier le fichier dans notre dossier d'upload
            new_path = os.path.join(settings.upload_path, f"{file_id}.{file_extension}")
            with open(file_path, 'rb') as src, open(new_path, 'wb') as dst:
                dst.write(src.read())
            
            # Créer l'entrée en base
            document = Document(
                id=file_id,
                user_id=current_user["id"],
                filename=filename,
                file_path=new_path,
                file_type=file_extension,
                file_size=file_size
            )
            db.add(document)
            
            batch_results.append({
                "document_id": file_id,
                "filename": filename,
                "original_path": file_path,
                "status": "queued"
            })
            
            # Traitement OCR en arrière-plan
            background_tasks.add_task(
                process_document_async,
                document_id=file_id,
                file_path=new_path,
                file_type=file_extension,
                db=db
            )
            
        except Exception as e:
            batch_results.append({
                "filename": os.path.basename(file_path),
                "original_path": file_path,
                "status": "error",
                "error": str(e)
            })
    
    db.commit()
    
    return {
        "batch_id": batch_id,
        "folder": folder_path,
        "recursive": recursive,
        "total_files": len(files_to_process),
        "queued": len([r for r in batch_results if r["status"] == "queued"]),
        "errors": len([r for r in batch_results if r["status"] == "error"]),
        "results": batch_results
    }


async def process_document_async(document_id: str, file_path: str, file_type: str, db: Session):
    """
    Traiter un document de manière asynchrone
    """
    try:
        # Traitement OCR
        ocr_text = await process_document(file_path, file_type)
        
        # Mettre à jour le document
        document = db.query(Document).filter(Document.id == document_id).first()
        if document:
            document.ocr_text = ocr_text
            document.processed_at = datetime.utcnow()
            
            # Calculer le nombre de pages pour les PDF
            if file_type == "pdf":
                import PyPDF2
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    document.pages = len(pdf_reader.pages)
            
            db.commit()
            
    except Exception as e:
        print(f"Erreur traitement document {document_id}: {e}")
        # Dans une vraie app, on pourrait mettre à jour un statut d'erreur