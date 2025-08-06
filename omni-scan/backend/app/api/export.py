"""API endpoints pour l'export de documents"""

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import List, Optional
import io

from app.core.database import get_supabase
from app.services.export import ExportService
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get("/export/{document_id}")
async def export_document(
    document_id: str,
    format: str = Query("pdf", regex="^(pdf|excel|json)$"),
    current_user = Depends(get_current_user)
):
    """
    Exporter un document dans le format spécifié
    
    - **format**: pdf, excel ou json
    """
    # Récupérer le document depuis Supabase
    supabase = get_supabase()
    
    response = await supabase.table("documents").select("*").eq("id", document_id).eq("user_id", current_user["id"]).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document = response.data
    
    # Préparer les données du document
    document_data = {
        "id": str(document.get("id", "")),
        "filename": document.get("filename", ""),
        "file_type": document.get("file_type", ""),
        "file_size": document.get("file_size", 0),
        "ocr_text": document.get("ocr_text", ""),
        "ai_analysis": document.get("ai_analysis", {}),
        "created_at": document.get("created_at"),
        "pages": document.get("pages", 1),
        "language": document.get("language", "fra"),
        "confidence_score": document.get("confidence_score")
    }
    
    # Exporter selon le format
    export_service = ExportService()
    
    if format == "json":
        content = await export_service.export_to_json(document_data)
        return StreamingResponse(
            io.BytesIO(content),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename={document_data['filename'].split('.')[0]}_export.json"
            }
        )
    
    elif format == "excel":
        content = await export_service.export_to_excel(document_data)
        return StreamingResponse(
            io.BytesIO(content),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={document_data['filename'].split('.')[0]}_export.xlsx"
            }
        )
    
    elif format == "pdf":
        content = await export_service.export_to_pdf(document_data)
        return StreamingResponse(
            io.BytesIO(content),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={document_data['filename'].split('.')[0]}_export.pdf"
            }
        )


@router.post("/export/batch")
async def export_batch_documents(
    document_ids: List[str],
    format: str = Query("json", regex="^(json|excel)$"),
    current_user = Depends(get_current_user)
):
    """
    Exporter plusieurs documents en un seul fichier
    
    - **document_ids**: Liste des IDs de documents à exporter
    - **format**: json ou excel
    """
    # Récupérer les documents depuis Supabase
    supabase = get_supabase()
    
    response = await supabase.table("documents").select("*").in_("id", document_ids).eq("user_id", current_user["id"]).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="No documents found")
    
    documents = response.data
    
    # Préparer les données
    documents_data = []
    for doc in documents:
        doc_data = {
            "id": str(doc.get("id", "")),
            "filename": doc.get("filename", ""),
            "file_type": doc.get("file_type", ""),
            "file_size": doc.get("file_size", 0),
            "ocr_text": doc.get("ocr_text", ""),
            "created_at": doc.get("created_at"),
            "pages": doc.get("pages", 1)
        }
        documents_data.append(doc_data)
    
    # Exporter
    export_service = ExportService()
    content = await export_service.export_batch(documents_data, format)
    
    if format == "json":
        return StreamingResponse(
            io.BytesIO(content),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=omniscan_batch_export.json"
            }
        )
    else:  # excel
        return StreamingResponse(
            io.BytesIO(content),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=omniscan_batch_export.xlsx"
            }
        )


@router.get("/export/formats")
async def get_export_formats(
    current_user = Depends(get_current_user)
):
    """
    Obtenir la liste des formats d'export disponibles avec leurs caractéristiques
    """
    return {
        "formats": [
            {
                "format": "pdf",
                "name": "PDF Document",
                "description": "Export professionnel avec mise en forme complète",
                "icon": "file-pdf",
                "premium": False,
                "features": [
                    "Mise en forme professionnelle",
                    "En-têtes et pieds de page",
                    "Table des matières pour documents longs",
                    "Support des images"
                ]
            },
            {
                "format": "excel",
                "name": "Excel Spreadsheet",
                "description": "Parfait pour l'analyse et le traitement des données",
                "icon": "file-excel",
                "premium": True,
                "features": [
                    "Données structurées",
                    "Multiples feuilles",
                    "Formatage conditionnel",
                    "Graphiques et tableaux"
                ]
            },
            {
                "format": "json",
                "name": "JSON Data",
                "description": "Format technique pour intégrations API",
                "icon": "file-code",
                "premium": True,
                "features": [
                    "Structure de données complète",
                    "Métadonnées incluses",
                    "Compatible avec toutes les plateformes",
                    "Idéal pour les développeurs"
                ]
            }
        ]
    }