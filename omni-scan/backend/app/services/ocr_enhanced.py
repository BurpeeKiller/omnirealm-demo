"""Service OCR amélioré avec prétraitement et optimisations"""

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import PyPDF2
from pdf2image import convert_from_path
import cv2
import numpy as np
from typing import Optional, Tuple
import os
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("ocr")


class EnhancedOCR:
    """OCR amélioré avec prétraitement d'image"""
    
    def __init__(self):
        self.tesseract_config = '--oem 3 --psm 6'  # LSTM + mode page uniforme
        
    async def process_document(self, file_path: str, file_type: str) -> str:
        """Extraire le texte d'un document avec prétraitement"""
        
        logger.info(f"Traitement OCR: {file_path} (type: {file_type})")
        
        try:
            if file_type in ["jpg", "jpeg", "png", "tiff", "bmp"]:
                return await self._process_image(file_path)
            elif file_type == "pdf":
                return await self._process_pdf(file_path)
            else:
                raise ValueError(f"Type non supporté: {file_type}")
                
        except Exception as e:
            logger.error(f"Erreur OCR: {e}")
            raise
    
    async def _process_image(self, image_path: str) -> str:
        """OCR sur image avec prétraitement"""
        # Charger l'image
        image = Image.open(image_path)
        
        # Prétraitement
        processed_image = self._preprocess_image(image)
        
        # OCR avec différentes configurations
        texts = []
        
        # Config 1: Standard
        text1 = pytesseract.image_to_string(
            processed_image,
            lang=settings.ocr_languages,
            config=self.tesseract_config
        )
        texts.append(text1)
        
        # Config 2: Si peu de texte, essayer avec d'autres paramètres
        if len(text1.strip()) < 50:
            # Mode caractères épars
            text2 = pytesseract.image_to_string(
                processed_image,
                lang=settings.ocr_languages,
                config='--oem 3 --psm 11'  # Sparse text
            )
            texts.append(text2)
            
            # Mode ligne unique
            text3 = pytesseract.image_to_string(
                processed_image,
                lang=settings.ocr_languages,
                config='--oem 3 --psm 7'  # Single line
            )
            texts.append(text3)
        
        # Retourner le texte le plus long
        best_text = max(texts, key=lambda t: len(t.strip()))
        
        # Post-traitement du texte
        cleaned_text = self._clean_text(best_text)
        
        logger.info(f"OCR terminé: {len(cleaned_text)} caractères extraits")
        return cleaned_text
    
    async def _process_pdf(self, pdf_path: str) -> str:
        """Traiter un PDF avec stratégie hybride"""
        
        # 1. Essayer d'extraire le texte natif
        native_text = self._extract_native_pdf_text(pdf_path)
        
        # Si suffisamment de texte natif, l'utiliser
        if len(native_text.strip()) > 200:
            logger.info("Utilisation du texte natif PDF")
            return self._clean_text(native_text)
        
        # 2. Sinon, OCR sur les pages
        logger.info("PDF sans texte natif, passage à l'OCR")
        return await self._ocr_pdf_pages(pdf_path)
    
    def _extract_native_pdf_text(self, pdf_path: str) -> str:
        """Extraire le texte natif d'un PDF"""
        text_parts = []
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                for page_num in range(min(len(pdf_reader.pages), 50)):  # Max 50 pages
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    
                    if page_text.strip():
                        text_parts.append(f"--- Page {page_num + 1} ---\n{page_text}")
                
        except Exception as e:
            logger.warning(f"Erreur extraction native PDF: {e}")
            
        return "\n\n".join(text_parts)
    
    async def _ocr_pdf_pages(self, pdf_path: str) -> str:
        """OCR sur les pages d'un PDF"""
        try:
            # Convertir avec résolution optimale
            images = convert_from_path(
                pdf_path, 
                dpi=200,  # Bon compromis qualité/performance
                first_page=1,
                last_page=min(50, None)  # Max 50 pages
            )
            
            text_parts = []
            
            for i, image in enumerate(images):
                logger.debug(f"OCR page {i+1}/{len(images)}")
                
                # Prétraiter l'image
                processed = self._preprocess_pil_image(image)
                
                # OCR
                page_text = pytesseract.image_to_string(
                    processed,
                    lang=settings.ocr_languages,
                    config=self.tesseract_config
                )
                
                if page_text.strip():
                    text_parts.append(f"--- Page {i+1} ---\n{page_text}")
            
            return self._clean_text("\n\n".join(text_parts))
            
        except Exception as e:
            logger.error(f"Erreur OCR PDF: {e}")
            raise
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """Prétraitement d'image pour améliorer l'OCR"""
        
        # Convertir en niveaux de gris
        if image.mode != 'L':
            image = image.convert('L')
        
        # Augmenter le contraste
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)
        
        # Appliquer un filtre de netteté
        image = image.filter(ImageFilter.SHARPEN)
        
        # Binarisation avec OpenCV
        img_array = np.array(image)
        _, binary = cv2.threshold(
            img_array, 
            0, 
            255, 
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )
        
        # Débruitage
        denoised = cv2.fastNlMeansDenoising(binary, h=30)
        
        # Redresser si nécessaire
        angle = self._get_skew_angle(denoised)
        if abs(angle) > 0.5:
            denoised = self._rotate_image(denoised, angle)
        
        return Image.fromarray(denoised)
    
    def _preprocess_pil_image(self, image: Image.Image) -> Image.Image:
        """Version simplifiée pour les images PIL"""
        # Convertir en niveaux de gris
        if image.mode != 'L':
            image = image.convert('L')
        
        # Augmenter le contraste
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.3)
        
        return image
    
    def _get_skew_angle(self, image: np.ndarray) -> float:
        """Détecter l'angle de rotation du texte"""
        try:
            coords = np.column_stack(np.where(image > 0))
            angle = cv2.minAreaRect(coords)[-1]
            
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle
                
            return angle
        except:
            return 0.0
    
    def _rotate_image(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Redresser l'image"""
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            image, 
            M, 
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )
        return rotated
    
    def _clean_text(self, text: str) -> str:
        """Nettoyer le texte extrait"""
        if not text:
            return ""
        
        # Supprimer les caractères de contrôle
        text = ''.join(char for char in text if char.isprintable() or char.isspace())
        
        # Normaliser les espaces
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Supprimer espaces multiples
            line = ' '.join(line.split())
            # Garder seulement les lignes avec du contenu
            if line.strip() and len(line.strip()) > 2:
                cleaned_lines.append(line)
        
        # Rejoindre avec des sauts de ligne simples
        cleaned = '\n'.join(cleaned_lines)
        
        # Supprimer les lignes répétées consécutives
        final_lines = []
        prev_line = None
        
        for line in cleaned.split('\n'):
            if line != prev_line:
                final_lines.append(line)
                prev_line = line
        
        return '\n'.join(final_lines)


# Instance globale
ocr_service = EnhancedOCR()


# Fonction de compatibilité
async def process_document(file_path: str, file_type: str) -> str:
    """Point d'entrée pour compatibilité avec l'ancien code"""
    return await ocr_service.process_document(file_path, file_type)