"""
Moteur OCR Tesseract (legacy, utilisé comme fallback)
"""

import pytesseract
from PIL import Image
import pdf2image
import tempfile
import os
from pathlib import Path
from typing import Optional, Dict, Any, List, Union
import numpy as np
import time

from app.core.logging import get_logger
from app.utils.image_preprocessing import ImagePreprocessor
from app.utils.ocr_postprocessing import improve_ocr_text

from .base import OCREngine, OCRResult, OCRConfig, OCRFeature, OutputFormat

logger = get_logger("ocr.tesseract")


class TesseractEngine(OCREngine):
    """Moteur OCR basé sur Tesseract"""
    
    def __init__(self, config: Optional[OCRConfig] = None):
        super().__init__(config)
        self.preprocessor = ImagePreprocessor()
        self.name = "Tesseract"
        self.version = None
        
    async def initialize(self) -> None:
        """Initialiser Tesseract"""
        try:
            self.version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract initialisé, version: {self.version}")
            self._initialized = True
        except Exception as e:
            logger.error(f"Erreur initialisation Tesseract: {e}")
            raise RuntimeError("Tesseract n'est pas installé ou non accessible")
    
    async def process_image(
        self,
        image: Union[str, Path, Image.Image, np.ndarray],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter une image avec Tesseract"""
        start_time = time.time()
        config = config or self.config
        
        try:
            # Charger l'image
            if isinstance(image, (str, Path)):
                pil_image = Image.open(image)
            elif isinstance(image, np.ndarray):
                pil_image = Image.fromarray(image)
            elif isinstance(image, Image.Image):
                pil_image = image
            else:
                raise ValueError(f"Type d'image non supporté: {type(image)}")
            
            # Preprocessing si activé
            if config.enable_preprocessing:
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
                    temp_path = tmp_file.name
                
                try:
                    processed_image = self.preprocessor.process(pil_image)
                    processed_image.save(temp_path)
                    pil_image = processed_image
                finally:
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
            
            # Configuration Tesseract
            tesseract_config = '--psm 3 --oem 3'  # Page segmentation + best OCR engine mode
            lang = "+".join(config.languages)
            
            # OCR
            text = pytesseract.image_to_string(
                pil_image,
                lang=lang,
                config=tesseract_config
            )
            
            # Post-processing si activé
            if config.enable_postprocessing and text:
                post_result = improve_ocr_text(text.strip())
                text = post_result.get('improved', text)
            
            # Calculer la confiance (approximation basique)
            confidence = 0.85 if len(text.strip()) > 50 else 0.7
            
            processing_time = time.time() - start_time
            
            # Créer le résultat
            result = OCRResult(
                text=text.strip(),
                confidence=confidence,
                processing_time=processing_time,
                language=config.languages[0] if config.languages else "unknown"
            )
            
            # Ajouter format markdown si demandé
            if config.output_format == OutputFormat.MARKDOWN:
                result.markdown = self._text_to_markdown(text)
            
            return result
            
        except Exception as e:
            logger.error(f"Erreur OCR Tesseract: {e}")
            raise
    
    async def process_pdf(
        self,
        pdf_path: Union[str, Path],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter un PDF avec Tesseract"""
        start_time = time.time()
        config = config or self.config
        
        try:
            # Convertir PDF en images
            images = pdf2image.convert_from_path(
                pdf_path,
                dpi=300,
                first_page=1,
                last_page=config.max_pages
            )
            
            all_texts = []
            total_confidence = 0.0
            
            for i, image in enumerate(images):
                page_num = i + 1
                logger.debug(f"Traitement page {page_num}/{len(images)}")
                
                # OCR sur chaque page
                page_result = await self.process_image(image, config)
                
                if page_result.text.strip():
                    all_texts.append(f"--- Page {page_num} ---\n{page_result.text}")
                    total_confidence += page_result.confidence
            
            # Combiner les résultats
            combined_text = "\n\n".join(all_texts)
            avg_confidence = total_confidence / len(images) if images else 0.0
            processing_time = time.time() - start_time
            
            result = OCRResult(
                text=combined_text,
                confidence=avg_confidence,
                processing_time=processing_time,
                page_count=len(images),
                language=config.languages[0] if config.languages else "unknown"
            )
            
            if config.output_format == OutputFormat.MARKDOWN:
                result.markdown = self._text_to_markdown(combined_text)
            
            return result
            
        except Exception as e:
            logger.error(f"Erreur OCR PDF Tesseract: {e}")
            raise
    
    def get_supported_features(self) -> List[OCRFeature]:
        """Fonctionnalités supportées par Tesseract"""
        return [
            OCRFeature.BASIC_TEXT,
            OCRFeature.MULTILINGUAL,
            OCRFeature.BATCH
        ]
    
    def get_supported_languages(self) -> List[str]:
        """Langues supportées"""
        try:
            langs = pytesseract.get_languages()
            # Filtrer les langues spéciales
            return [lang for lang in langs if lang not in ["osd", "equ"]]
        except Exception:
            return ["eng", "fra", "deu", "spa", "ita"]  # Fallback
    
    def get_info(self) -> Dict[str, Any]:
        """Informations sur le moteur"""
        return {
            "name": self.name,
            "version": str(self.version) if self.version else "unknown",
            "type": "traditional",
            "requires_gpu": False,
            "supported_formats": ["jpg", "jpeg", "png", "tiff", "bmp", "pdf"],
            "max_resolution": "unlimited",
            "features": [f.value for f in self.get_supported_features()],
            "languages": self.get_supported_languages()[:10]  # Top 10 pour l'affichage
        }
    
    def _text_to_markdown(self, text: str) -> str:
        """Convertir le texte brut en markdown basique"""
        lines = text.split('\n')
        markdown_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                markdown_lines.append("")
            elif line.startswith("---") and line.endswith("---"):
                # Headers de page
                page_text = line.replace("---", "").strip()
                markdown_lines.append(f"\n## {page_text}\n")
            elif len(line) < 50 and line.isupper():
                # Probablement un titre
                markdown_lines.append(f"### {line.title()}")
            else:
                markdown_lines.append(line)
        
        return "\n".join(markdown_lines)