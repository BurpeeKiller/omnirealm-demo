"""
Service OCR unifié
Combine les fonctionnalités de ocr.py et ocr_simple.py
"""

from typing import Optional, Dict, Any, List
import pytesseract
from PIL import Image
import pdf2image
import cv2
import numpy as np
from pathlib import Path

from app.core.logging import get_logger
from app.utils.image_preprocessing import ImagePreprocessor
from app.utils.ocr_postprocessing import OCRPostProcessor

logger = get_logger("ocr_unified")


class OCRConfig:
    """Configuration pour le service OCR"""
    def __init__(
        self,
        enable_preprocessing: bool = True,
        enable_postprocessing: bool = True,
        save_preprocessed: bool = False,
        tesseract_config: str = "--oem 3 --psm 3",
        languages: List[str] = None,
        pdf_dpi: int = 300,
        max_pages: Optional[int] = None
    ):
        self.enable_preprocessing = enable_preprocessing
        self.enable_postprocessing = enable_postprocessing
        self.save_preprocessed = save_preprocessed
        self.tesseract_config = tesseract_config
        self.languages = languages or ["fra", "eng"]
        self.pdf_dpi = pdf_dpi
        self.max_pages = max_pages


class UnifiedOCRService:
    """Service OCR unifié avec options configurables"""
    
    def __init__(self, config: Optional[OCRConfig] = None):
        self.config = config or OCRConfig()
        self._verify_tesseract()
        self._progress_callback = None  # Callback pour la progression
        # Initialiser les processeurs
        self.image_preprocessor = ImagePreprocessor()
        self.text_postprocessor = OCRPostProcessor()
    
    def _verify_tesseract(self):
        """Vérifier que Tesseract est installé"""
        try:
            version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract version: {version}")
        except Exception as e:
            logger.error(f"Tesseract not found: {e}")
            raise RuntimeError("Tesseract OCR is not installed or not in PATH")
    
    async def process_document(
        self,
        file_path: str,
        file_type: str,
        options: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Traiter un document et extraire le texte.
        
        Args:
            file_path: Chemin vers le fichier
            file_type: Type de fichier (pdf, png, jpg, etc.)
            options: Options supplémentaires
        
        Returns:
            Texte extrait
        """
        options = options or {}
        
        # Fusionner les options avec la config par défaut
        enable_preprocessing = options.get("enable_preprocessing", self.config.enable_preprocessing)
        enable_postprocessing = options.get("enable_postprocessing", self.config.enable_postprocessing)
        languages = options.get("languages", self.config.languages)
        
        try:
            if file_type.lower() == "pdf":
                text = await self._process_pdf(file_path, languages, enable_preprocessing)
            else:
                text = await self._process_image(file_path, languages, enable_preprocessing)
            
            # Post-traitement si activé
            if enable_postprocessing and text:
                text = self.text_postprocessor.process(text)
            
            return text
            
        except Exception as e:
            logger.error(f"Error processing document: {e}", exc_info=True)
            raise
    
    async def _process_pdf(
        self,
        pdf_path: str,
        languages: List[str],
        enable_preprocessing: bool
    ) -> str:
        """Traiter un fichier PDF"""
        logger.info(f"Processing PDF: {pdf_path}")
        
        try:
            # Convertir PDF en images
            images = pdf2image.convert_from_path(
                pdf_path,
                dpi=self.config.pdf_dpi,
                first_page=1,
                last_page=self.config.max_pages
            )
            
            # Traiter chaque page
            texts = []
            total_pages = len(images)
            # Stocker le nombre de pages pour l'usage externe
            self._last_total_pages = total_pages
            
            for i, image in enumerate(images):
                current_page = i + 1
                logger.debug(f"Processing page {current_page}/{total_pages}")
                
                # Callback de progression si disponible
                if self._progress_callback:
                    self._progress_callback(current_page, total_pages)
                
                # Preprocessing si activé
                if enable_preprocessing:
                    # La méthode process() de ImagePreprocessor prend un chemin ou une image PIL
                    # et retourne une image PIL
                    image = self.image_preprocessor.process(image)
                
                # OCR sur l'image
                page_text = pytesseract.image_to_string(
                    image,
                    lang="+".join(languages),
                    config=self.config.tesseract_config
                )
                
                if page_text.strip():
                    texts.append(f"--- Page {current_page} ---\n{page_text}")
            
            return "\n\n".join(texts)
            
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            raise
    
    async def _process_image(
        self,
        image_path: str,
        languages: List[str],
        enable_preprocessing: bool
    ) -> str:
        """Traiter un fichier image"""
        logger.info(f"Processing image: {image_path}")
        
        try:
            # Charger l'image
            if enable_preprocessing:
                # Utiliser OpenCV pour le preprocessing
                img = cv2.imread(image_path)
                if img is None:
                    raise ValueError(f"Could not read image: {image_path}")
                
                # Appliquer le preprocessing avec l'instance de la classe
                # Le preprocessor prend directement le chemin de l'image
                processed_pil = self.image_preprocessor.process(image_path)
                # Reconvertir en numpy array pour OpenCV
                processed_img = np.array(processed_pil.convert('RGB'))
                processed_img = cv2.cvtColor(processed_img, cv2.COLOR_RGB2BGR)
                
                # Sauvegarder l'image prétraitée si demandé
                if self.config.save_preprocessed:
                    preprocessed_path = image_path.replace(".", "_preprocessed.")
                    cv2.imwrite(preprocessed_path, processed_img)
                    logger.debug(f"Saved preprocessed image: {preprocessed_path}")
                
                # Convertir en PIL Image pour Tesseract
                image = Image.fromarray(cv2.cvtColor(processed_img, cv2.COLOR_BGR2RGB))
            else:
                # Charger directement avec PIL
                image = Image.open(image_path)
            
            # OCR
            text = pytesseract.image_to_string(
                image,
                lang="+".join(languages),
                config=self.config.tesseract_config
            )
            
            return text
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise
    
    async def process_batch(
        self,
        file_paths: List[str],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Traiter plusieurs documents en lot.
        
        Returns:
            Dict avec file_path comme clé et texte extrait comme valeur
        """
        results = {}
        
        for file_path in file_paths:
            try:
                # Déterminer le type de fichier
                file_ext = Path(file_path).suffix.lower().lstrip(".")
                
                # Traiter le document
                text = await self.process_document(file_path, file_ext, options)
                results[file_path] = text
                
            except Exception as e:
                logger.error(f"Error processing {file_path}: {e}")
                results[file_path] = f"Error: {str(e)}"
        
        return results
    
    def get_available_languages(self) -> List[str]:
        """Obtenir la liste des langues disponibles"""
        try:
            langs = pytesseract.get_languages()
            return [lang for lang in langs if lang not in ["osd", "equ"]]
        except Exception as e:
            logger.error(f"Error getting languages: {e}")
            return ["eng", "fra"]  # Fallback
    
    async def analyze_document_quality(self, file_path: str) -> Dict[str, Any]:
        """
        Analyser la qualité d'un document pour l'OCR.
        
        Returns:
            Dict avec métriques de qualité
        """
        try:
            img = cv2.imread(file_path)
            if img is None:
                # Si c'est un PDF, prendre la première page
                if file_path.lower().endswith('.pdf'):
                    images = pdf2image.convert_from_path(file_path, first_page=1, last_page=1)
                    if images:
                        img = np.array(images[0])
                    else:
                        raise ValueError("Could not extract first page from PDF")
                else:
                    raise ValueError(f"Could not read file: {file_path}")
            
            # Analyser la qualité
            height, width = img.shape[:2]
            
            # Calculer la netteté (variance du Laplacien)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Calculer le contraste
            contrast = gray.std()
            
            # Détecter le bruit
            noise_level = self._estimate_noise(gray)
            
            # Recommandations
            recommendations = []
            quality_score = 100
            
            if laplacian_var < 100:
                recommendations.append("L'image est floue, améliorer la netteté")
                quality_score -= 20
            
            if contrast < 30:
                recommendations.append("Contraste faible, ajuster les niveaux")
                quality_score -= 15
            
            if noise_level > 10:
                recommendations.append("Niveau de bruit élevé, appliquer un filtre de débruitage")
                quality_score -= 10
            
            if width < 1000 or height < 1000:
                recommendations.append("Résolution faible, scanner à une résolution plus élevée (300 DPI minimum)")
                quality_score -= 25
            
            return {
                "dimensions": {"width": width, "height": height},
                "sharpness": float(laplacian_var),
                "contrast": float(contrast),
                "noise_level": float(noise_level),
                "quality_score": max(0, quality_score),
                "recommendations": recommendations,
                "suitable_for_ocr": quality_score >= 50
            }
            
        except Exception as e:
            logger.error(f"Error analyzing document quality: {e}")
            return {
                "error": str(e),
                "suitable_for_ocr": False
            }
    
    def _estimate_noise(self, image: np.ndarray) -> float:
        """Estimer le niveau de bruit dans une image"""
        # Méthode basée sur la médiane du filtre Laplacien
        lap = cv2.Laplacian(image, cv2.CV_64F)
        sigma = np.median(np.abs(lap)) * 1.4826
        return sigma


# Instance globale par défaut
default_ocr_service = UnifiedOCRService()


# Fonctions de compatibilité avec l'ancienne interface
async def process_document(file_path: str, file_type: str) -> str:
    """Fonction de compatibilité avec ocr_simple.py"""
    return await default_ocr_service.process_document(file_path, file_type)


async def extract_text_from_file(file_path: str, file_type: str) -> str:
    """Fonction de compatibilité avec ocr.py"""
    config = OCRConfig(
        enable_preprocessing=True,
        enable_postprocessing=True
    )
    service = UnifiedOCRService(config)
    return await service.process_document(file_path, file_type)