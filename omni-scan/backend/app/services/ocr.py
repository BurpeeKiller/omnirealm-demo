"""Service OCR avec Tesseract"""

import pytesseract
from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
import tempfile
import os
from app.core.config import settings
from app.utils.ocr_postprocessing import improve_ocr_text
from app.utils.image_preprocessing import ImagePreprocessor


async def process_document(file_path: str, file_type: str) -> str:
    """Extraire le texte d'un document"""
    
    if file_type in ["jpg", "jpeg", "png", "tiff", "bmp"]:
        # Image directe
        return extract_text_from_image(file_path)
    
    elif file_type == "pdf":
        # PDF - essayer d'abord l'extraction native
        text = extract_text_from_pdf(file_path)
        
        # Si peu de texte, faire l'OCR
        if len(text.strip()) < 100:
            text = await ocr_pdf(file_path)
        
        return text
    
    else:
        raise ValueError(f"Type de fichier non supporté: {file_type}")


def extract_text_from_image(image_path: str) -> str:
    """OCR sur une image"""
    try:
        # Preprocessing de l'image
        preprocessor = ImagePreprocessor()
        
        # Créer un fichier temporaire pour l'image prétraitée
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
            temp_path = tmp_file.name
            
        try:
            # Prétraiter l'image
            processed_image = preprocessor.process(image_path)
            processed_image.save(temp_path)
            
            # OCR avec Tesseract sur l'image prétraitée
            raw_text = pytesseract.image_to_string(
                temp_path,
                lang=settings.ocr_languages,
                config='--psm 3 --oem 3'  # Mode page + meilleur modèle OCR
            )
            
            # Post-processing pour améliorer la qualité
            result = improve_ocr_text(raw_text.strip())
            
            return result['improved']
            
        finally:
            # Nettoyer le fichier temporaire
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        raise Exception(f"Erreur OCR image: {e}")


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extraire le texte natif d'un PDF"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Erreur extraction PDF native: {e}")
        return ""


async def ocr_pdf(pdf_path: str) -> str:
    """OCR sur toutes les pages d'un PDF"""
    try:
        # Convertir PDF en images
        images = convert_from_path(pdf_path, dpi=300)
        
        all_text = []
        for i, image in enumerate(images):
            # OCR sur chaque page
            text = pytesseract.image_to_string(
                image,
                lang=settings.ocr_languages
            )
            all_text.append(f"--- Page {i+1} ---\n{text}")
        
        return "\n\n".join(all_text)
    
    except Exception as e:
        raise Exception(f"Erreur OCR PDF: {e}")