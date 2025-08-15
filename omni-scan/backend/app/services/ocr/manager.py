"""
Gestionnaire OCR - Sélection et orchestration des moteurs
"""

from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import os

from app.core.logging import get_logger
from app.core.config import settings

from .base import OCREngine, OCRResult, OCRConfig, OCRFeature, OutputFormat
from .tesseract import TesseractEngine

logger = get_logger("ocr.manager")


class OCRManager:
    """Gestionnaire principal pour les moteurs OCR"""
    
    def __init__(self):
        self.engines: Dict[str, OCREngine] = {}
        self.default_engine = "tesseract"
        self._initialized = False
        
    async def initialize(self) -> None:
        """Initialiser les moteurs disponibles"""
        if self._initialized:
            return
            
        logger.info("Initialisation du gestionnaire OCR...")
        
        # Toujours charger Tesseract comme fallback
        try:
            tesseract = TesseractEngine()
            await tesseract.initialize()
            self.engines["tesseract"] = tesseract
            logger.info("Moteur Tesseract chargé")
        except Exception as e:
            logger.error(f"Impossible de charger Tesseract: {e}")
        
        # Essayer de charger GOT-OCR2.0 si disponible
        if self._check_got_ocr_available():
            try:
                from .got_ocr2 import GOTOCR2Engine
                got_engine = GOTOCR2Engine()
                await got_engine.initialize()
                self.engines["got-ocr2"] = got_engine
                self.default_engine = "got-ocr2"  # Utiliser par défaut si disponible
                logger.info("Moteur GOT-OCR2.0 chargé et défini par défaut")
            except Exception as e:
                logger.warning(f"GOT-OCR2.0 non disponible: {e}")
        
        # Essayer de charger le moteur OCR léger (prioritaire pour VPS)
        if self._check_lightweight_available():
            try:
                from .lightweight_ocr import LightweightOCREngine
                lightweight_engine = LightweightOCREngine()
                await lightweight_engine.initialize()
                self.engines["lightweight"] = lightweight_engine
                if "lightweight" not in self.default_engine:  # Prioriser si disponible
                    self.default_engine = "lightweight"
                logger.info("Moteur OCR léger chargé et défini par défaut")
            except Exception as e:
                logger.warning(f"Moteur OCR léger non disponible: {e}")
        
        # Essayer de charger TrOCR si disponible
        if self._check_trocr_available():
            try:
                from .trocr import TrOCREngine
                trocr_engine = TrOCREngine()
                await trocr_engine.initialize()
                self.engines["trocr"] = trocr_engine
                logger.info("Moteur TrOCR chargé")
            except Exception as e:
                logger.warning(f"TrOCR non disponible: {e}")
        
        if not self.engines:
            raise RuntimeError("Aucun moteur OCR disponible!")
        
        self._initialized = True
        logger.info(f"Gestionnaire OCR initialisé avec {len(self.engines)} moteur(s)")
        logger.info(f"Moteur par défaut: {self.default_engine}")
    
    def _check_got_ocr_available(self) -> bool:
        """Vérifier si GOT-OCR2.0 est disponible"""
        try:
            import torch
            import transformers
            # Vérifier si le modèle est en cache ou si on peut le télécharger
            model_name = os.getenv("GOT_OCR2_MODEL", "stepfun-ai/GOT-OCR2_0")
            # TODO: Implémenter une vraie vérification
            return os.getenv("ENABLE_GOT_OCR2", "false").lower() == "true"
        except ImportError:
            return False
    
    def _check_lightweight_available(self) -> bool:
        """Vérifier si le moteur OCR léger est disponible"""
        try:
            # Vérifier les dépendances de base
            import cv2
            import numpy as np
            from PIL import Image
            
            # Le moteur léger peut fonctionner même sans EasyOCR/PaddleOCR
            # Il se dégradera gracieusement vers Tesseract
            enable_lightweight = os.getenv("ENABLE_LIGHTWEIGHT_OCR", "true").lower() == "true"
            
            logger.debug(f"Moteur léger {'activé' if enable_lightweight else 'désactivé'} par configuration")
            return enable_lightweight
        except ImportError as e:
            logger.warning(f"Dépendances manquantes pour moteur léger: {e}")
            return False
    
    def _check_trocr_available(self) -> bool:
        """Vérifier si TrOCR est disponible"""
        try:
            import torch
            import transformers
            return os.getenv("ENABLE_TROCR", "false").lower() == "true"
        except ImportError:
            return False
    
    async def process_document(
        self,
        file_path: Union[str, Path],
        file_type: str,
        engine_name: Optional[str] = None,
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter un document avec le moteur spécifié ou le meilleur disponible"""
        if not self._initialized:
            await self.initialize()
        
        # Sélectionner le moteur
        engine = self._select_engine(engine_name, config)
        
        logger.info(f"Traitement du document avec le moteur: {engine.get_info()['name']}")
        
        # Traiter le document
        result = await engine.process_document(file_path, file_type, config)
        
        # Ajouter des métadonnées sur le moteur utilisé
        result.warnings = result.warnings or []
        result.warnings.append(f"Traité avec: {engine.get_info()['name']} v{engine.get_info()['version']}")
        
        return result
    
    def _select_engine(
        self,
        engine_name: Optional[str] = None,
        config: Optional[OCRConfig] = None
    ) -> OCREngine:
        """Sélectionner le meilleur moteur selon les besoins"""
        # Si un moteur spécifique est demandé
        if engine_name and engine_name in self.engines:
            return self.engines[engine_name]
        
        # Si pas de config, utiliser le moteur par défaut
        if not config:
            return self.engines[self.default_engine]
        
        # Sélection intelligente basée sur les besoins
        required_features = []
        
        if config.extract_tables:
            required_features.append(OCRFeature.TABLES)
        if config.extract_formulas:
            required_features.append(OCRFeature.FORMULAS)
        if config.regions:
            required_features.append(OCRFeature.INTERACTIVE)
        
        # Trouver le meilleur moteur
        for name, engine in self.engines.items():
            if all(engine.can_handle(feature) for feature in required_features):
                logger.debug(f"Moteur sélectionné: {name} pour les features: {required_features}")
                return engine
        
        # Fallback sur le moteur par défaut
        logger.warning(f"Aucun moteur ne supporte toutes les features demandées, utilisation de: {self.default_engine}")
        return self.engines[self.default_engine]
    
    def get_available_engines(self) -> Dict[str, Dict[str, Any]]:
        """Retourner les informations sur les moteurs disponibles"""
        return {
            name: engine.get_info()
            for name, engine in self.engines.items()
        }
    
    def get_supported_features(self) -> List[OCRFeature]:
        """Retourner toutes les fonctionnalités supportées par au moins un moteur"""
        all_features = set()
        for engine in self.engines.values():
            all_features.update(engine.get_supported_features())
        return list(all_features)
    
    def get_supported_languages(self) -> List[str]:
        """Retourner toutes les langues supportées"""
        all_languages = set()
        for engine in self.engines.values():
            all_languages.update(engine.get_supported_languages())
        return sorted(list(all_languages))
    
    async def cleanup(self) -> None:
        """Nettoyer tous les moteurs"""
        for engine in self.engines.values():
            await engine.cleanup()
        self.engines.clear()
        self._initialized = False


# Instance singleton
_ocr_manager: Optional[OCRManager] = None


def get_ocr_manager() -> OCRManager:
    """Obtenir l'instance singleton du gestionnaire OCR"""
    global _ocr_manager
    if _ocr_manager is None:
        _ocr_manager = OCRManager()
    return _ocr_manager