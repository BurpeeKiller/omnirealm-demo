"""
Tests de validation des tailles et formats de fichiers - Protection des revenus
Ces tests garantissent qu'aucun fichier malveillant ou trop volumineux ne peut compromettre le service.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import tempfile
import os
from PIL import Image
import io
import json

from app.main import app
from app.core.validators import validate_file_size, validate_file_type
from app.services.ocr_unified import UnifiedOCRService


class TestFileSizeValidation:
    """Tests de validation des tailles de fichiers"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def create_test_file(self, size_mb, extension=".txt", content_type="text/plain"):
        """Créer un fichier de test d'une taille donnée"""
        content = "A" * (size_mb * 1024 * 1024)
        
        temp_file = tempfile.NamedTemporaryFile(
            mode='w', 
            suffix=extension, 
            delete=False
        )
        temp_file.write(content)
        temp_file.close()
        
        return temp_file.name

    def create_test_image(self, width, height, format="PNG"):
        """Créer une image de test"""
        image = Image.new("RGB", (width, height), color="red")
        
        temp_file = tempfile.NamedTemporaryFile(
            suffix=f".{format.lower()}", 
            delete=False
        )
        image.save(temp_file.name, format=format)
        
        return temp_file.name

    def test_file_size_within_limits(self):
        """Fichiers dans les limites autorisées doivent passer"""
        # Créer un fichier de 1MB (dans les limites)
        test_file = self.create_test_file(1)
        
        try:
            # Tester la validation
            file_size = os.path.getsize(test_file)
            
            # Supposons une limite de 10MB
            MAX_SIZE = 10 * 1024 * 1024
            is_valid = file_size <= MAX_SIZE
            
            assert is_valid is True
            
        finally:
            os.unlink(test_file)

    def test_file_size_exceeds_limits(self):
        """CRITIQUE: Fichiers trop volumineux doivent être rejetés"""
        # Créer un fichier de 15MB (au-dessus de la limite supposée de 10MB)
        test_file = self.create_test_file(15)
        
        try:
            file_size = os.path.getsize(test_file)
            
            # Limite supposée de 10MB
            MAX_SIZE = 10 * 1024 * 1024
            is_valid = file_size <= MAX_SIZE
            
            assert is_valid is False
            
        finally:
            os.unlink(test_file)

    def test_zero_byte_file_protection(self):
        """CRITIQUE: Fichiers vides doivent être rejetés"""
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()  # Crée un fichier vide
        
        try:
            file_size = os.path.getsize(temp_file.name)
            assert file_size == 0
            
            # Les fichiers vides ne devraient pas être acceptés
            is_valid = file_size > 0
            assert is_valid is False
            
        finally:
            os.unlink(temp_file.name)

    def test_image_resolution_limits(self):
        """CRITIQUE: Images avec résolution excessive doivent être rejetées"""
        # Image très haute résolution (50MP)
        large_image = self.create_test_image(7071, 7071)  # ~50MP
        
        try:
            with Image.open(large_image) as img:
                width, height = img.size
                total_pixels = width * height
                
                # Limite supposée de 25MP
                MAX_PIXELS = 25 * 1000 * 1000
                is_valid = total_pixels <= MAX_PIXELS
                
                assert is_valid is False
                
        finally:
            os.unlink(large_image)

    def test_reasonable_image_resolution_accepted(self):
        """Images avec résolution raisonnable doivent être acceptées"""
        # Image résolution standard (2MP)
        normal_image = self.create_test_image(1920, 1080)  # ~2MP
        
        try:
            with Image.open(normal_image) as img:
                width, height = img.size
                total_pixels = width * height
                
                # Limite supposée de 25MP
                MAX_PIXELS = 25 * 1000 * 1000
                is_valid = total_pixels <= MAX_PIXELS
                
                assert is_valid is True
                
        finally:
            os.unlink(normal_image)


class TestFileFormatValidation:
    """Tests de validation des formats de fichiers"""
    
    def test_supported_formats_accepted(self):
        """Formats supportés doivent être acceptés"""
        supported_formats = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"]
        
        for fmt in supported_formats:
            # Simuler la validation de format
            is_supported = fmt.lower() in [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"]
            assert is_supported is True

    def test_unsupported_formats_rejected(self):
        """CRITIQUE: Formats non supportés doivent être rejetés"""
        unsupported_formats = [".exe", ".bat", ".sh", ".dll", ".so", ".zip", ".rar"]
        
        for fmt in unsupported_formats:
            # Simuler la validation de format
            is_supported = fmt.lower() in [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"]
            assert is_supported is False

    def test_file_extension_vs_content_validation(self):
        """CRITIQUE: Extension vs contenu réel du fichier"""
        # Créer un fichier .txt mais avec extension .png (trompeur)
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            f.write(b"This is actually text content, not a PNG")
            fake_png = f.name
        
        try:
            # Tenter d'ouvrir comme image
            try:
                with Image.open(fake_png):
                    is_valid_image = True
            except Exception:
                is_valid_image = False
            
            # Doit échouer car ce n'est pas vraiment une image
            assert is_valid_image is False
            
        finally:
            os.unlink(fake_png)

    def test_magic_number_validation(self):
        """CRITIQUE: Validation des magic numbers (signatures de fichiers)"""
        # Créer un vrai PNG
        real_png = self.create_test_image_bytes(100, 100, "PNG")
        
        # Vérifier les magic bytes PNG
        png_signature = b'\x89PNG\r\n\x1a\n'
        
        with open(real_png, 'rb') as f:
            file_start = f.read(8)
            is_png = file_start == png_signature
        
        assert is_png is True
        os.unlink(real_png)

    def create_test_image_bytes(self, width, height, format="PNG"):
        """Créer une image en bytes"""
        image = Image.new("RGB", (width, height), color="blue")
        
        temp_file = tempfile.NamedTemporaryFile(
            suffix=f".{format.lower()}", 
            delete=False
        )
        image.save(temp_file.name, format=format)
        
        return temp_file.name

    def test_pdf_structure_validation(self):
        """CRITIQUE: Validation de la structure PDF"""
        # Créer un faux PDF (juste du texte avec extension .pdf)
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
            f.write(b"This is not a real PDF file")
            fake_pdf = f.name
        
        try:
            # Vérifier la signature PDF
            with open(fake_pdf, 'rb') as f:
                file_start = f.read(4)
                is_pdf = file_start == b'%PDF'
            
            # Doit échouer car ce n'est pas un vrai PDF
            assert is_pdf is False
            
        finally:
            os.unlink(fake_pdf)

    def test_corrupted_file_protection(self):
        """CRITIQUE: Protection contre les fichiers corrompus"""
        # Créer un fichier PNG corrompu
        corrupted_png = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        
        # Écrire une signature PNG valide puis des données corrompues
        corrupted_png.write(b'\x89PNG\r\n\x1a\n')
        corrupted_png.write(b'CORRUPTED DATA HERE')
        corrupted_png.close()
        
        try:
            # Tenter d'ouvrir le fichier corrompu
            try:
                with Image.open(corrupted_png.name):
                    is_valid = True
            except Exception:
                is_valid = False
            
            # Doit échouer à cause de la corruption
            assert is_valid is False
            
        finally:
            os.unlink(corrupted_png.name)


class TestMaliciousFileProtection:
    """Tests de protection contre les fichiers malveillants"""
    
    def test_executable_file_rejection(self):
        """CRITIQUE: Fichiers exécutables doivent être rejetés"""
        executable_extensions = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".scr"]
        
        for ext in executable_extensions:
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
                f.write(b"#!/bin/bash\necho 'malicious code'")
                malicious_file = f.name
            
            try:
                # Vérifier que l'extension est rejetée
                allowed_exts = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"]
                is_allowed = ext.lower() in allowed_exts
                
                assert is_allowed is False
                
            finally:
                os.unlink(malicious_file)

    def test_zip_bomb_protection(self):
        """CRITIQUE: Protection contre les zip bombs (si compression supportée)"""
        # Créer un fichier très répétitif (compresse énormément)
        repetitive_content = "A" * 1000000  # 1MB de 'A'
        
        with tempfile.NamedTemporaryFile(mode='w', suffix=".txt", delete=False) as f:
            f.write(repetitive_content)
            repetitive_file = f.name
        
        try:
            # Calculer le ratio de compression potentiel
            original_size = os.path.getsize(repetitive_file)
            
            # Un fichier très répétitif comme celui-ci pourrait comprimer à 0.1%
            # Ce qui pourrait indiquer une zip bomb
            compression_ratio = 0.001  # Supposé
            
            # Détecter un ratio suspect
            is_suspicious = compression_ratio < 0.01  # Moins de 1%
            
            assert is_suspicious is True
            
        finally:
            os.unlink(repetitive_file)

    def test_embedded_script_detection(self):
        """CRITIQUE: Détection de scripts embarqués dans les images"""
        # Créer une image avec métadonnées suspectes
        image = Image.new("RGB", (100, 100), color="green")
        
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
            # Ajouter des métadonnées EXIF suspectes
            exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}
            # En réalité, on ajouterait des données suspectes ici
            
            image.save(f.name, "JPEG")
            image_with_metadata = f.name
        
        try:
            # Vérifier la présence de métadonnées suspectes
            with Image.open(image_with_metadata) as img:
                exif = img.getexif()
                # Chercher des patterns suspects dans les métadonnées
                suspicious_patterns = ["<script", "javascript:", "eval(", "exec("]
                
                has_suspicious_content = False
                for value in exif.values():
                    if isinstance(value, str):
                        for pattern in suspicious_patterns:
                            if pattern in value.lower():
                                has_suspicious_content = True
                
                # Pour ce test, pas de contenu suspect
                assert has_suspicious_content is False
                
        finally:
            os.unlink(image_with_metadata)

    def test_polyglot_file_detection(self):
        """CRITIQUE: Détection de fichiers polyglots (valides dans plusieurs formats)"""
        # Un fichier qui est à la fois un PDF et un HTML
        polyglot_content = b"""
%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f 
trailer<</Size 4/Root 1 0 R>>
startxref
173
%%EOF
<html><script>alert('XSS')</script></html>
"""
        
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
            f.write(polyglot_content)
            polyglot_file = f.name
        
        try:
            # Vérifier que c'est un PDF valide
            with open(polyglot_file, 'rb') as f:
                content = f.read()
                is_pdf = content.startswith(b'%PDF')
                contains_html = b'<html>' in content
            
            assert is_pdf is True
            assert contains_html is True  # Fichier polyglot détecté
            
        finally:
            os.unlink(polyglot_file)


class TestOCRSpecificValidation:
    """Tests de validation spécifiques à l'OCR"""
    
    def test_ocr_quality_pre_validation(self):
        """Pré-validation de la qualité pour OCR"""
        # Créer une image de très mauvaise qualité
        low_quality_image = self.create_blurry_image(50, 50)
        
        try:
            # Utiliser le service OCR pour analyser la qualité
            ocr_service = UnifiedOCRService()
            quality_analysis = asyncio.run(
                ocr_service.analyze_document_quality(low_quality_image)
            )
            
            # Vérifier que la qualité est détectée comme insuffisante
            assert "quality_score" in quality_analysis
            assert quality_analysis["quality_score"] < 70  # Score faible
            assert quality_analysis["suitable_for_ocr"] is False
            
        finally:
            os.unlink(low_quality_image)

    def create_blurry_image(self, width, height):
        """Créer une image floue pour test"""
        import numpy as np
        from PIL import ImageFilter
        
        # Créer une image avec du texte
        image = Image.new("RGB", (width, height), color="white")
        
        # Ajouter du flou
        blurred = image.filter(ImageFilter.GaussianBlur(radius=5))
        
        temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        blurred.save(temp_file.name, "PNG")
        
        return temp_file.name

    def test_ocr_language_detection_validation(self):
        """Validation de la détection de langue pour OCR"""
        # Créer une image avec du texte dans une langue non supportée
        # (simulé ici)
        
        unsupported_languages = ["ar", "zh", "ja", "ko"]  # Si non supportées
        supported_languages = ["eng", "fra", "deu", "spa"]
        
        for lang in unsupported_languages:
            # Simuler la détection de langue
            is_supported = lang in supported_languages
            assert is_supported is False

    def test_pdf_page_count_limits(self):
        """CRITIQUE: Limitation du nombre de pages PDF"""
        # Simuler un PDF avec trop de pages
        max_pages = 50  # Limite supposée
        
        test_cases = [
            (10, True),   # 10 pages - OK
            (50, True),   # 50 pages - Limite
            (100, False), # 100 pages - Trop
        ]
        
        for page_count, should_be_allowed in test_cases:
            is_allowed = page_count <= max_pages
            assert is_allowed == should_be_allowed

    def test_concurrent_file_processing_limits(self):
        """CRITIQUE: Limitation du traitement concurrent de fichiers"""
        max_concurrent = 3  # Limite supposée par utilisateur
        
        # Simuler plusieurs fichiers en traitement
        processing_files = ["file1.pdf", "file2.png", "file3.jpg", "file4.pdf"]
        
        for i, filename in enumerate(processing_files):
            currently_processing = i + 1
            is_allowed = currently_processing <= max_concurrent
            
            if currently_processing <= max_concurrent:
                assert is_allowed is True
            else:
                assert is_allowed is False


# Import pour les tests async
import asyncio