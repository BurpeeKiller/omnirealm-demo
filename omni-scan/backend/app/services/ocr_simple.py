"""Service OCR simplifié et fonctionnel"""

import pytesseract
from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("ocr")


async def process_document(file_path: str, file_type: str) -> str:
    """Extraire le texte d'un document - version simple et stable"""
    
    logger.info(f"Traitement OCR: {file_path} (type: {file_type})")
    
    try:
        if file_type in ["jpg", "jpeg", "png", "tiff", "bmp"]:
            # OCR direct sur image
            return _ocr_image(file_path)
            
        elif file_type == "pdf":
            # Essayer d'abord le texte natif
            text = _extract_pdf_text(file_path)
            
            # Si pas assez de texte, faire OCR
            if len(text.strip()) < 50:
                logger.info("PDF sans texte natif, passage à l'OCR")
                text = await _ocr_pdf(file_path)
            
            return text
            
        else:
            raise ValueError(f"Type non supporté: {file_type}")
            
    except Exception as e:
        logger.error(f"Erreur OCR: {e}")
        raise


def _ocr_image(image_path: str) -> str:
    """OCR simple sur une image"""
    try:
        # Ouvrir l'image
        image = Image.open(image_path)
        
        # OCR avec configuration simple
        text = pytesseract.image_to_string(
            image,
            lang=settings.ocr_languages  # 'eng' maintenant
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
    """OCR sur les pages d'un PDF"""
    try:
        # Convertir PDF en images (résolution raisonnable)
        images = convert_from_path(
            pdf_path,
            dpi=150,  # Suffisant pour la plupart des textes
            first_page=1,
            last_page=min(10, None)  # Max 10 pages pour les tests
        )
        
        all_text = []
        
        for i, image in enumerate(images):
            logger.debug(f"OCR page {i+1}/{len(images)}")
            
            # OCR simple
            page_text = pytesseract.image_to_string(
                image,
                lang=settings.ocr_languages
            )
            
            if page_text.strip():
                all_text.append(f"--- Page {i+1} ---\n{page_text}")
        
        return "\n\n".join(all_text)
        
    except Exception as e:
        logger.error(f"Erreur OCR PDF: {e}")
        raise