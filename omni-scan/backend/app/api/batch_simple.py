"""API endpoints pour le traitement par batch - Version simplifiée"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
import uuid
import os

from app.core.config import settings
from app.api.dependencies import get_current_user

router = APIRouter()


@router.post("/batch/upload")
async def upload_batch(
    files: List[UploadFile] = File(...),
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
            # Valider le fichier (validation basique)
            if not file.filename:
                raise ValueError("Nom de fichier manquant")
            
            file_extension = file.filename.split('.')[-1].lower()
            allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'bmp']
            if file_extension not in allowed_extensions:
                raise ValueError(f"Extension non supportée: {file_extension}")
            
            # Générer un nom unique
            file_id = str(uuid.uuid4())
            file_extension = file.filename.split('.')[-1].lower()
            file_path = os.path.join(settings.upload_path, f"{file_id}.{file_extension}")
            
            # Sauvegarder le fichier
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            
            batch_results.append({
                "document_id": file_id,
                "filename": file.filename,
                "status": "uploaded",
                "batch_id": batch_id,
                "file_path": file_path
            })
            
        except Exception as e:
            batch_results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e),
                "batch_id": batch_id
            })
    
    return {
        "batch_id": batch_id,
        "total_files": len(files),
        "uploaded": len([r for r in batch_results if r["status"] == "uploaded"]),
        "errors": len([r for r in batch_results if r["status"] == "error"]),
        "results": batch_results
    }


@router.get("/batch/{batch_id}/status")
async def get_batch_status(
    batch_id: str,
    current_user = Depends(get_current_user)
):
    """
    Obtenir le statut d'un batch de documents
    """
    # Pour l'instant, retourner un statut simulé
    return {
        "batch_id": batch_id,
        "status": "processing",
        "message": "Batch processing functionality coming soon"
    }