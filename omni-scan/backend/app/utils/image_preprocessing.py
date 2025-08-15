"""
Preprocessing des images pour améliorer la qualité OCR
"""
import cv2
import numpy as np
from PIL import Image, ImageEnhance
import io
from typing import Union


class ImagePreprocessor:
    """Améliore la qualité des images pour l'OCR"""
    
    def __init__(self):
        self.target_dpi = 300  # DPI optimal pour OCR
        
    def process(self, image_input: Union[str, Image.Image]) -> Image.Image:
        """
        Applique une série de traitements pour améliorer l'image
        
        Args:
            image_input: Chemin vers l'image ou objet Image PIL
        """
        # Charger l'image avec PIL si c'est un chemin
        if isinstance(image_input, str):
            img = Image.open(image_input)
        else:
            img = image_input
        
        # 1. Convertir en RGB si nécessaire
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 2. Redimensionner si trop petite
        img = self._ensure_minimum_size(img)
        
        # 3. Améliorer la netteté
        img = self._enhance_sharpness(img)
        
        # 4. Améliorer le contraste
        img = self._enhance_contrast(img)
        
        # 5. Convertir en niveaux de gris
        img = img.convert('L')
        
        # 6. Appliquer des traitements OpenCV
        # Convertir PIL -> OpenCV
        opencv_img = np.array(img)
        
        # Débruitage
        opencv_img = cv2.fastNlMeansDenoising(opencv_img, None, 10, 7, 21)
        
        # Binarisation adaptative
        opencv_img = self._adaptive_threshold(opencv_img)
        
        # Correction de l'inclinaison
        opencv_img = self._deskew(opencv_img)
        
        # Retour en PIL
        return Image.fromarray(opencv_img)
    
    def _ensure_minimum_size(self, img: Image.Image, min_width: int = 1000) -> Image.Image:
        """
        Redimensionne l'image si elle est trop petite
        """
        width, height = img.size
        if width < min_width:
            ratio = min_width / width
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        return img
    
    def _enhance_sharpness(self, img: Image.Image, factor: float = 2.0) -> Image.Image:
        """
        Améliore la netteté de l'image
        """
        enhancer = ImageEnhance.Sharpness(img)
        return enhancer.enhance(factor)
    
    def _enhance_contrast(self, img: Image.Image, factor: float = 1.5) -> Image.Image:
        """
        Améliore le contraste de l'image
        """
        enhancer = ImageEnhance.Contrast(img)
        return enhancer.enhance(factor)
    
    def _adaptive_threshold(self, img: np.ndarray) -> np.ndarray:
        """
        Applique un seuillage adaptatif pour binariser l'image
        """
        # Seuillage adaptatif avec méthode Gaussienne
        binary = cv2.adaptiveThreshold(
            img,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            11,  # Taille du voisinage
            2    # Constante soustraite de la moyenne
        )
        return binary
    
    def _deskew(self, img: np.ndarray) -> np.ndarray:
        """
        Corrige l'inclinaison de l'image
        """
        # Détecter l'angle d'inclinaison
        coords = np.column_stack(np.where(img > 0))
        
        if len(coords) == 0:
            return img
            
        angle = cv2.minAreaRect(coords)[-1]
        
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
            
        # Limiter la correction à ±5 degrés
        if abs(angle) > 5:
            return img
            
        # Appliquer la rotation
        (h, w) = img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            img, 
            M, 
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )
        
        return rotated
    
    def _remove_noise(self, img: np.ndarray) -> np.ndarray:
        """
        Supprime le bruit de l'image
        """
        # Morphologie pour supprimer les petits points
        kernel = np.ones((2, 2), np.uint8)
        img = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)
        img = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)
        
        return img
    
    def preprocess_for_ocr(self, image_path: str, output_path: str = None) -> str:
        """
        Prétraite l'image et la sauvegarde si un chemin est fourni
        """
        processed_img = self.process(image_path)
        
        if output_path:
            processed_img.save(output_path)
            return output_path
        else:
            # Sauvegarder dans un buffer
            buffer = io.BytesIO()
            processed_img.save(buffer, format='PNG')
            buffer.seek(0)
            return buffer


# Fonction wrapper pour compatibilité
def preprocess_image(image_path: Union[str, Image.Image]) -> Image.Image:
    """
    Fonction wrapper pour préprocesser une image
    
    Args:
        image_path: Chemin vers l'image ou objet Image PIL
        
    Returns:
        Image PIL préprocessée
    """
    preprocessor = ImagePreprocessor()
    if isinstance(image_path, str):
        return preprocessor.process(image_path)
    else:
        # Si c'est déjà une image PIL, la sauvegarder temporairement
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            image_path.save(tmp.name)
            result = preprocessor.process(tmp.name)
            import os
            os.unlink(tmp.name)
            return result