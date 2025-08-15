"""Service OCR simplifié et fonctionnel"""

import pytesseract
from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
from app.core.config import settings
from app.core.logging import get_logger
from app.services.text_cleaner import text_cleaner

logger = get_logger("ocr")


async def process_document(file_path: str, file_type: str) -> str:
    """Extraire le texte d'un document - version simple et stable"""
    
    logger.info(f"Traitement OCR: {file_path} (type: {file_type})")
    
    try:
        text = ""
        
        if file_type in ["jpg", "jpeg", "png", "tiff", "bmp"]:
            # OCR direct sur image
            text = _ocr_image(file_path)
            
        elif file_type == "pdf":
            # Essayer d'abord le texte natif
            text = _extract_pdf_text(file_path)
            
            # Si pas assez de texte, faire OCR
            if len(text.strip()) < 50:
                logger.info("PDF sans texte natif, passage à l'OCR")
                text = await _ocr_pdf(file_path)
            
        elif file_type == "txt":
            # Lire directement le fichier texte
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        
        else:
            raise ValueError(f"Type non supporté: {file_type}")
        
        # Nettoyer le texte extrait
        if text:
            text = text_cleaner.clean_text(text)
            text = text_cleaner.merge_hyphenated_words(text)
            text = text_cleaner.remove_page_numbers(text)
            text = text_cleaner.clean_ocr_artifacts(text)
            
        return text
            
    except Exception as e:
        logger.error(f"Erreur OCR: {e}")
        raise


def _ocr_image(image_path: str) -> str:
    """OCR optimisé sur une image"""
    try:
        # Ouvrir l'image
        image = Image.open(image_path)
        
        # Configuration OCR optimisée pour le français
        custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
        
        # OCR avec configuration améliorée
        text = pytesseract.image_to_string(
            image,
            lang=settings.ocr_languages,  # 'fra+eng' par défaut
            config=custom_config
        )
        
        logger.info(f"OCR terminé: {len(text)} caractères extraits")
        return text.strip()
        
    except Exception as e:
        logger.error(f"Erreur OCR image: {e}")
        raise


def _extract_pdf_text(pdf_path: str) -> str:
    """Extraire le texte natif d'un PDF"""
    text = ""
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Limiter à 50 pages max
            num_pages = min(len(pdf_reader.pages), 50)
            
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                
                if page_text:
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page_text
                    
    except Exception as e:
        logger.warning(f"Erreur extraction PDF native: {e}")
        
    return text.strip()


async def _ocr_pdf(pdf_path: str) -> str:
    """OCR optimisé sur les pages d'un PDF"""
    try:
        # Convertir PDF en images avec meilleure résolution pour le français
        images = convert_from_path(
            pdf_path,
            dpi=200,  # Meilleure résolution pour les accents
            first_page=1,
            last_page=None  # Traiter tout le document
        )
        
        all_text = []
        custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
        
        for i, image in enumerate(images):
            logger.debug(f"OCR page {i+1}/{len(images)}")
            
            # OCR optimisé
            page_text = pytesseract.image_to_string(
                image,
                lang=settings.ocr_languages,
                config=custom_config
            )
            
            if page_text.strip():
                # Ne plus ajouter les marqueurs de page dans le texte
                all_text.append(page_text)
        
        # Joindre les pages sans séparateur visible
        return "\n\n".join(all_text)
        
    except Exception as e:
        logger.error(f"Erreur OCR PDF: {e}")
        raise