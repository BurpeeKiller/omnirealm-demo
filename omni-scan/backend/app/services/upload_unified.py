"""
Service d'upload unifié
Combine les fonctionnalités de upload.py et upload_simple.py
"""

import os
import uuid
from typing import Optional, Dict, Any
from datetime import datetime

from app.core.config import settings
from app.core.logging import get_logger
from app.core.database import get_supabase
from app.services.ocr_v2 import process_document_advanced
from app.services.ai_analysis_unified import AIAnalyzer, AIProvider, analyze_with_custom_key
from app.services.auth_unified import UnifiedAuthService
from app.core.validators import validate_file_extension, validate_file_size, sanitize_filename
from app.core.exceptions import FileValidationError

logger = get_logger("upload_unified")


class UploadMode:
    """Modes d'upload disponibles"""
    FULL = "full"        # Mode complet avec stockage en BD
    SIMPLE = "simple"    # Mode simple sans stockage
    BATCH = "batch"      # Mode batch pour plusieurs fichiers


class UploadConfig:
    """Configuration pour le service d'upload"""
    def __init__(
        self,
        mode: str = UploadMode.FULL,
        store_files: bool = True,
        store_results: bool = True,
        require_auth: bool = True,
        check_quota: bool = True,
        enable_ocr: bool = True,
        enable_ai: bool = True,
        ai_provider: AIProvider = AIProvider.OPENAI
    ):
        self.mode = mode
        self.store_files = store_files
        self.store_results = store_results
        self.require_auth = require_auth
        self.check_quota = check_quota
        self.enable_ocr = enable_ocr
        self.enable_ai = enable_ai
        self.ai_provider = ai_provider


class UnifiedUploadService:
    """Service d'upload unifié"""
    
    def __init__(self, config: Optional[UploadConfig] = None):
        self.config = config or UploadConfig()
        self.auth_service = UnifiedAuthService()
        self._progress_callback = None  # Callback pour la progression
    
    async def process_upload(
        self,
        file_content: bytes,
        filename: str,
        user_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Traiter un upload de fichier.
        
        Args:
            file_content: Contenu du fichier
            filename: Nom du fichier
            user_id: ID utilisateur (optionnel selon config)
            options: Options supplémentaires (AI provider, API key, etc.)
        
        Returns:
            Résultat du traitement
        """
        options = options or {}
        
        # Validation du fichier
        clean_filename = sanitize_filename(filename)
        file_ext = self._validate_file(clean_filename, file_content)
        
        # Vérifier l'authentification si requise
        if self.config.require_auth and not user_id:
            raise ValueError("Authentication required for upload")
        
        # Vérifier le quota si requis
        if self.config.check_quota and user_id:
            quota_check = await self.auth_service.check_quota(user_id)
            if not quota_check.get("allowed", True):
                raise ValueError(f"Quota exceeded: {quota_check.get('reason', 'unknown')}")
        
        # Générer un ID unique pour le document
        document_id = str(uuid.uuid4())
        
        # Sauvegarder le fichier temporairement
        temp_path = await self._save_temp_file(document_id, file_ext, file_content)
        
        try:
            # Traiter le document
            result = await self._process_document(
                document_id=document_id,
                file_path=temp_path,
                file_ext=file_ext,
                filename=clean_filename,
                user_id=user_id,
                options=options
            )
            
            # Stocker si configuré
            if self.config.store_results and user_id:
                await self._store_results(document_id, user_id, result)
            
            # Incrémenter l'usage si configuré
            if self.config.check_quota and user_id:
                await self.auth_service.increment_usage(user_id)
            
            return result
            
        finally:
            # Nettoyer le fichier temporaire si pas de stockage
            if not self.config.store_files and os.path.exists(temp_path):
                os.remove(temp_path)
    
    def _validate_file(self, filename: str, content: bytes) -> str:
        """Valider le fichier et retourner l'extension"""
        if not filename:
            raise FileValidationError("Nom de fichier manquant")
        
        try:
            file_ext = validate_file_extension(filename, settings.allowed_extensions)
        except ValueError as e:
            raise FileValidationError(str(e), file_name=filename)
        
        file_size = len(content)
        try:
            validate_file_size(file_size, settings.max_file_size_mb)
        except ValueError as e:
            raise FileValidationError(str(e), file_name=filename)
        
        return file_ext
    
    async def _save_temp_file(self, document_id: str, file_ext: str, content: bytes) -> str:
        """Sauvegarder le fichier temporairement"""
        temp_path = os.path.join(settings.temp_path, f"{document_id}.{file_ext}")
        
        # Créer le dossier si nécessaire
        os.makedirs(settings.temp_path, exist_ok=True)
        
        # Écrire le fichier
        with open(temp_path, "wb") as f:
            f.write(content)
        
        return temp_path
    
    async def _process_document(
        self,
        document_id: str,
        file_path: str,
        file_ext: str,
        filename: str,
        user_id: Optional[str],
        options: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Traiter le document (OCR + AI)"""
        result = {
            "document_id": document_id,
            "filename": filename,
            "processing_time": {},
            "success": True
        }
        
        # Mise à jour de la progression
        if self._progress_callback:
            self._progress_callback(1, 3, "Démarrage du traitement...")
        
        # OCR si activé
        extracted_text = ""
        if self.config.enable_ocr:
            if self._progress_callback:
                self._progress_callback(1, 3, "Extraction du texte (OCR)...")
            
            start_time = datetime.utcnow()
            try:
                # Utiliser le nouveau service OCR v2
                ocr_options = options.get("ocr_options", {})
                ocr_options["engine"] = options.get("ocr_engine")  # Permettre de choisir le moteur
                
                ocr_result = await process_document_advanced(
                    file_path,
                    file_ext,
                    ocr_options
                )
                
                extracted_text = ocr_result.get("text", "")
                result["extracted_text"] = extracted_text
                result["ocr_confidence"] = ocr_result.get("confidence", 0.0)
                result["ocr_metadata"] = {
                    "engine_used": ocr_result.get("engine_used", "unknown"),
                    "page_count": ocr_result.get("page_count", 1),
                    "processing_time": ocr_result.get("processing_time", 0.0)
                }
                result["text_length"] = len(extracted_text)
                result["processing_time"]["ocr"] = (datetime.utcnow() - start_time).total_seconds()
            except Exception as e:
                logger.error(f"OCR error for {document_id}: {e}")
                result["ocr_error"] = str(e)
                result["success"] = False
        
        # Analyse AI si activée et OCR réussi
        if self.config.enable_ai and extracted_text:
            # Mise à jour de la progression pour l'IA
            if self._progress_callback:
                total_steps = result.get("ocr_metadata", {}).get("page_count", 1) + 1
                self._progress_callback(total_steps - 1, total_steps, "Analyse IA en cours...")
            
            start_time = datetime.utcnow()
            try:
                # Récupérer le provider et la clé API des options
                ai_provider = options.get("ai_provider", self.config.ai_provider.value)
                custom_api_key = options.get("api_key")
                
                # Convertir le provider string en enum
                provider_enum = AIProvider[ai_provider.upper()]
                
                # Analyser avec l'IA
                if custom_api_key:
                    ai_analysis = await analyze_with_custom_key(
                        text=extracted_text,
                        provider=provider_enum,
                        api_key=custom_api_key,
                        detail_level=options.get("detail_level", "medium"),
                        language=options.get("language"),
                        include_structured_data=options.get("include_structured_data", True),
                        chapter_summaries=options.get("chapter_summaries", False)
                    )
                else:
                    analyzer = AIAnalyzer(provider=provider_enum)
                    async with analyzer:
                        ai_analysis = await analyzer.analyze_text(
                            extracted_text,
                            detail_level=options.get("detail_level", "medium"),
                            language=options.get("language"),
                            include_structured_data=options.get("include_structured_data", True),
                            chapter_summaries=options.get("chapter_summaries", False)
                        )
                
                result["ai_analysis"] = ai_analysis
                result["processing_time"]["ai"] = (datetime.utcnow() - start_time).total_seconds()
                
                if self._progress_callback:
                    self._progress_callback(3, 3, "Traitement terminé !")
            except Exception as e:
                logger.error(f"AI analysis error for {document_id}: {e}")
                result["ai_error"] = str(e)
        
        # Temps total
        result["processing_time"]["total"] = sum(result["processing_time"].values())
        
        return result
    
    async def _store_results(self, document_id: str, user_id: str, result: Dict[str, Any]) -> None:
        """Stocker les résultats en base de données"""
        if self.config.mode != UploadMode.FULL:
            return
        
        try:
            supabase = get_supabase()
            
            # Préparer les données pour la BD
            document_data = {
                "id": document_id,
                "user_id": user_id,
                "filename": result.get("filename"),
                "file_size": result.get("file_size", 0),
                "extracted_text": result.get("extracted_text", ""),
                "ai_analysis": result.get("ai_analysis", {}),
                "processing_time": result.get("processing_time", {}),
                "status": "completed" if result.get("success") else "failed",
                "error": result.get("ocr_error") or result.get("ai_error"),
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Insérer dans la table documents
            response = supabase.table("documents").insert(document_data).execute()
            
            if response.data:
                logger.info(f"Document {document_id} stored successfully")
            
        except Exception as e:
            logger.error(f"Error storing document {document_id}: {e}")
            # Ne pas faire échouer l'upload si le stockage échoue
    
    async def process_batch(
        self,
        files: list,
        user_id: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> list:
        """
        Traiter plusieurs fichiers en lot.
        
        Args:
            files: Liste de tuples (filename, content)
            user_id: ID utilisateur
            options: Options pour tous les fichiers
        
        Returns:
            Liste des résultats
        """
        results = []
        
        for filename, content in files:
            try:
                result = await self.process_upload(
                    file_content=content,
                    filename=filename,
                    user_id=user_id,
                    options=options
                )
                results.append(result)
            except Exception as e:
                logger.error(f"Error processing {filename}: {e}")
                results.append({
                    "filename": filename,
                    "success": False,
                    "error": str(e)
                })
        
        return results


# Instance globale par défaut
default_upload_service = UnifiedUploadService()


def get_upload_service(mode: str = UploadMode.FULL) -> UnifiedUploadService:
    """Obtenir une instance du service d'upload"""
    config = UploadConfig(mode=mode)
    return UnifiedUploadService(config)