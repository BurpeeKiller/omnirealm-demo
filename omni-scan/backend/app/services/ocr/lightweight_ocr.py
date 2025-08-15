"""
Moteur OCR léger optimisé pour VPS avec ressources limitées
Combinaison EasyOCR + PaddleOCR + optimisations mémoire
"""

import asyncio
import time
from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import os
import gc

from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import cv2

from app.core.logging import get_logger
from .base import OCREngine, OCRResult, OCRConfig, OCRFeature, OutputFormat, BoundingBox

logger = get_logger("ocr.lightweight")


class LightweightOCREngine(OCREngine):
    """Moteur OCR léger optimisé pour les VPS avec ressources limitées"""
    
    def __init__(self, config: Optional[OCRConfig] = None):
        super().__init__(config)
        self.easyocr_reader = None
        self.paddle_ocr = None
        self.use_paddle = os.getenv("ENABLE_PADDLE_OCR", "true").lower() == "true"
        self.use_easy = os.getenv("ENABLE_EASY_OCR", "true").lower() == "true"
        self.memory_limit_mb = int(os.getenv("OCR_MEMORY_LIMIT_MB", "512"))
        self._model_cache = {}
        
    async def initialize(self) -> None:
        """Initialisation paresseuse des modèles pour économiser la mémoire"""
        if self._initialized:
            return
            
        logger.info("Initialisation du moteur OCR léger...")
        
        try:
            # Initialiser seulement si nécessaire et pas déjà en cache
            if self.use_easy and "easyocr" not in self._model_cache:
                await self._init_easyocr()
            
            if self.use_paddle and "paddleocr" not in self._model_cache:
                await self._init_paddleocr()
                
            self._initialized = True
            logger.info(f"Moteur OCR léger initialisé (EasyOCR: {self.use_easy}, PaddleOCR: {self.use_paddle})")
            
        except Exception as e:
            logger.error(f"Erreur initialisation OCR léger: {e}")
            # Fallback sur Tesseract si disponible
            logger.warning("Fallback sur configuration minimale...")
            self._initialized = True
    
    async def _init_easyocr(self) -> None:
        """Initialiser EasyOCR avec optimisations mémoire"""
        try:
            import easyocr
            
            # Configuration minimaliste pour économiser la mémoire
            self.easyocr_reader = easyocr.Reader(
                ['en', 'fr'], 
                gpu=False,  # Force CPU pour compatibilité VPS
                model_storage_directory=os.getenv("OCR_MODEL_CACHE", "./models"),
                download_enabled=True,
                detector_batch_size=1,  # Minimal batch size
                recognition_batch_size=1,
                width_ths=0.7,  # Optimisé pour documents
                height_ths=0.7,
                slope_ths=0.1,
                ycenter_ths=0.5,
                canvas_size=1024,  # Limite la résolution pour économiser RAM
                mag_ratio=1.0
            )
            
            self._model_cache["easyocr"] = self.easyocr_reader
            logger.info("EasyOCR initialisé avec succès (mode économe)")
            
        except ImportError:
            logger.warning("EasyOCR non disponible - installer avec: pip install easyocr")
            self.use_easy = False
        except Exception as e:
            logger.error(f"Erreur initialisation EasyOCR: {e}")
            self.use_easy = False
    
    async def _init_paddleocr(self) -> None:
        """Initialiser PaddleOCR avec optimisations mémoire"""
        try:
            from paddleocr import PaddleOCR
            
            # Configuration optimisée pour CPU et faible mémoire
            self.paddle_ocr = PaddleOCR(
                use_angle_cls=True,
                lang='fr',  # Français prioritaire
                use_gpu=False,  # Force CPU
                show_log=False,
                det_model_dir=None,  # Utiliser modèles par défaut
                rec_model_dir=None,
                cls_model_dir=None,
                det_limit_side_len=960,  # Limite résolution
                det_limit_type='min',
                rec_batch_num=1,  # Traitement unitaire pour économiser RAM
                max_text_length=25,
                rec_char_dict_path=None,
                use_space_char=True,
                drop_score=0.5,  # Score minimum pour filtrer bruit
                use_tensorrt=False,
                precision='fp32',
                cpu_threads=2,  # Limite threads CPU
                enable_mkldnn=False  # Désactiver optimisations Intel pour compatibilité
            )
            
            self._model_cache["paddleocr"] = self.paddle_ocr
            logger.info("PaddleOCR initialisé avec succès (mode économe)")
            
        except ImportError:
            logger.warning("PaddleOCR non disponible - installer avec: pip install paddlepaddle paddleocr")
            self.use_paddle = False
        except Exception as e:
            logger.error(f"Erreur initialisation PaddleOCR: {e}")
            self.use_paddle = False
    
    async def process_image(
        self,
        image: Union[str, Path, Image.Image, np.ndarray],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter une image avec le moteur le plus adapté"""
        start_time = time.time()
        config = config or self.config
        
        if not self._initialized:
            await self.initialize()
        
        # Préprocessing optimisé
        processed_image = await self._preprocess_image(image, config)
        
        # Choisir la meilleure stratégie selon le type de document
        result = await self._process_with_best_engine(processed_image, config)
        
        result.processing_time = time.time() - start_time
        
        # Nettoyage mémoire après traitement
        await self._memory_cleanup()
        
        return result
    
    async def process_pdf(
        self,
        pdf_path: Union[str, Path],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter un PDF page par page avec optimisations mémoire"""
        from pdf2image import convert_from_path
        
        start_time = time.time()
        config = config or self.config
        
        # Conversion PDF optimisée (résolution réduite pour économiser RAM)
        pages = convert_from_path(
            pdf_path,
            dpi=150,  # Résolution réduite mais suffisante
            first_page=1,
            last_page=config.max_pages if config.max_pages else None,
            poppler_path=None,
            fmt='jpeg',
            jpegopt={'quality': 85, 'progressive': True, 'optimize': True}
        )
        
        combined_text = []
        total_confidence = 0
        page_count = len(pages)
        
        for i, page in enumerate(pages):
            logger.debug(f"Traitement page {i+1}/{page_count}")
            
            # Traiter la page
            page_result = await self.process_image(page, config)
            combined_text.append(page_result.text)
            total_confidence += page_result.confidence
            
            # Libérer la mémoire de la page immédiatement
            del page
            if i % 3 == 0:  # Nettoyage périodique
                gc.collect()
        
        # Résultat final
        result = OCRResult(
            text="\n\n".join(combined_text),
            confidence=total_confidence / page_count if page_count > 0 else 0,
            processing_time=time.time() - start_time,
            page_count=page_count,
            warnings=[f"Traité avec moteur léger optimisé ({page_count} pages)"]
        )
        
        return result
    
    async def _preprocess_image(
        self,
        image: Union[str, Path, Image.Image, np.ndarray],
        config: OCRConfig
    ) -> Image.Image:
        """Préprocessing d'image optimisé pour l'OCR"""
        
        # Charger l'image
        if isinstance(image, (str, Path)):
            pil_image = Image.open(image)
        elif isinstance(image, np.ndarray):
            pil_image = Image.fromarray(image)
        else:
            pil_image = image.copy()
        
        if not config.enable_preprocessing:
            return pil_image
        
        # Convertir en RGB si nécessaire
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Redimensionner si trop grand (économie mémoire)
        max_size = (1920, 1920)  # Limite raisonnable
        if pil_image.size[0] > max_size[0] or pil_image.size[1] > max_size[1]:
            pil_image.thumbnail(max_size, Image.Resampling.LANCZOS)
            logger.debug(f"Image redimensionnée vers {pil_image.size}")
        
        # Améliorations de qualité légères
        if config.enhance_quality:
            # Augmenter légèrement le contraste
            enhancer = ImageEnhance.Contrast(pil_image)
            pil_image = enhancer.enhance(1.2)
            
            # Netteté douce
            enhancer = ImageEnhance.Sharpness(pil_image)
            pil_image = enhancer.enhance(1.1)
        
        return pil_image
    
    async def _process_with_best_engine(
        self,
        image: Image.Image,
        config: OCRConfig
    ) -> OCRResult:
        """Traiter avec le meilleur moteur disponible selon le contexte"""
        
        # Stratégie de sélection intelligente
        if self.use_paddle and self._should_use_paddle(image):
            return await self._process_with_paddle(image, config)
        elif self.use_easy:
            return await self._process_with_easyocr(image, config)
        else:
            # Fallback sur une méthode basique
            return await self._fallback_processing(image, config)
    
    def _should_use_paddle(self, image: Image.Image) -> bool:
        """Déterminer si PaddleOCR est plus adapté que EasyOCR"""
        # PaddleOCR généralement meilleur pour documents structurés
        # EasyOCR pour texte naturel et multilingue
        
        # Analyse simple de la complexité
        width, height = image.size
        aspect_ratio = width / height
        
        # Documents A4/Letter ont ratio ~0.7-0.8
        if 0.6 <= aspect_ratio <= 0.9:
            return True  # Probablement un document structuré
        
        return False
    
    async def _process_with_paddle(
        self,
        image: Image.Image,
        config: OCRConfig
    ) -> OCRResult:
        """Traitement avec PaddleOCR"""
        try:
            # Conversion pour PaddleOCR
            img_array = np.array(image)
            
            # OCR avec PaddleOCR
            results = self.paddle_ocr.ocr(img_array, cls=True)
            
            # Parser les résultats
            extracted_text = []
            total_confidence = 0
            text_blocks = []
            
            for line_result in results[0] if results and results[0] else []:
                if line_result:
                    bbox, (text, confidence) = line_result
                    extracted_text.append(text)
                    total_confidence += confidence
                    
                    # Coordonnées du texte
                    text_blocks.append({
                        'text': text,
                        'confidence': confidence,
                        'bbox': {
                            'x': int(min(p[0] for p in bbox)),
                            'y': int(min(p[1] for p in bbox)),
                            'width': int(max(p[0] for p in bbox) - min(p[0] for p in bbox)),
                            'height': int(max(p[1] for p in bbox) - min(p[1] for p in bbox))
                        }
                    })
            
            avg_confidence = total_confidence / len(extracted_text) if extracted_text else 0
            
            return OCRResult(
                text="\n".join(extracted_text),
                confidence=avg_confidence,
                text_blocks=text_blocks,
                warnings=["Traité avec PaddleOCR (optimisé documents)"]
            )
            
        except Exception as e:
            logger.error(f"Erreur PaddleOCR: {e}")
            return await self._fallback_processing(image, config)
    
    async def _process_with_easyocr(
        self,
        image: Image.Image,
        config: OCRConfig
    ) -> OCRResult:
        """Traitement avec EasyOCR"""
        try:
            # Conversion pour EasyOCR
            img_array = np.array(image)
            
            # OCR avec EasyOCR
            results = self.easyocr_reader.readtext(
                img_array,
                detail=1,
                paragraph=True,  # Grouper par paragraphes
                width_ths=0.7,
                height_ths=0.7
            )
            
            # Parser les résultats
            extracted_text = []
            total_confidence = 0
            text_blocks = []
            
            for (bbox, text, confidence) in results:
                if confidence > config.min_confidence:
                    extracted_text.append(text)
                    total_confidence += confidence
                    
                    # Coordonnées du texte
                    x_coords = [p[0] for p in bbox]
                    y_coords = [p[1] for p in bbox]
                    
                    text_blocks.append({
                        'text': text,
                        'confidence': confidence,
                        'bbox': {
                            'x': int(min(x_coords)),
                            'y': int(min(y_coords)),
                            'width': int(max(x_coords) - min(x_coords)),
                            'height': int(max(y_coords) - min(y_coords))
                        }
                    })
            
            avg_confidence = total_confidence / len(extracted_text) if extracted_text else 0
            
            return OCRResult(
                text="\n".join(extracted_text),
                confidence=avg_confidence,
                text_blocks=text_blocks,
                warnings=["Traité avec EasyOCR (optimisé multilingue)"]
            )
            
        except Exception as e:
            logger.error(f"Erreur EasyOCR: {e}")
            return await self._fallback_processing(image, config)
    
    async def _fallback_processing(
        self,
        image: Image.Image,
        config: OCRConfig
    ) -> OCRResult:
        """Traitement de secours basique"""
        logger.warning("Utilisation du traitement de secours")
        
        # Très basique - juste retourner un message
        return OCRResult(
            text="Erreur: Aucun moteur OCR disponible",
            confidence=0.0,
            warnings=["Échec de tous les moteurs OCR"]
        )
    
    async def _memory_cleanup(self) -> None:
        """Nettoyage mémoire après traitement"""
        gc.collect()  # Force garbage collection
        
        # Log mémoire si en mode debug
        if logger.level <= 10:  # DEBUG
            try:
                import psutil
                process = psutil.Process()
                memory_mb = process.memory_info().rss / 1024 / 1024
                logger.debug(f"Utilisation mémoire: {memory_mb:.1f} MB")
                
                if memory_mb > self.memory_limit_mb:
                    logger.warning(f"Limite mémoire dépassée: {memory_mb:.1f}MB > {self.memory_limit_mb}MB")
            except ImportError:
                pass
    
    def get_supported_features(self) -> List[OCRFeature]:
        """Fonctionnalités supportées par le moteur léger"""
        features = [
            OCRFeature.BASIC_TEXT,
            OCRFeature.MULTILINGUAL,
            OCRFeature.BATCH
        ]
        
        return features
    
    def get_supported_languages(self) -> List[str]:
        """Langues supportées"""
        return ["fr", "en", "de", "es", "it", "pt"]
    
    def get_info(self) -> Dict[str, Any]:
        """Informations sur le moteur"""
        return {
            "name": "Lightweight OCR",
            "version": "1.0.0",
            "description": "Moteur OCR léger optimisé pour VPS (EasyOCR + PaddleOCR)",
            "memory_optimized": True,
            "cpu_optimized": True,
            "engines_available": {
                "easyocr": self.use_easy,
                "paddleocr": self.use_paddle
            },
            "memory_limit_mb": self.memory_limit_mb
        }
    
    async def cleanup(self) -> None:
        """Nettoyer les ressources"""
        # Libérer les modèles
        self.easyocr_reader = None
        self.paddle_ocr = None
        self._model_cache.clear()
        
        # Force garbage collection
        gc.collect()
        
        self._initialized = False
        logger.info("Moteur OCR léger nettoyé")