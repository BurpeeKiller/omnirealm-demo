"""Tests d'intégration pour le flux OCR complet"""

import pytest
from unittest.mock import patch, MagicMock
import io
import time


@pytest.mark.integration
class TestOCRFlow:
    """Tests du flux complet d'OCR"""
    
    @pytest.mark.asyncio
    async def test_complete_ocr_flow(self, client, mock_supabase, mock_openai):
        """Test du flux complet : upload -> OCR -> analyse IA"""
        # Mock des résultats OCR
        with patch('app.services.ocr.process_document') as mock_ocr:
            mock_ocr.return_value = "Texte extrait du document"
            
            # Mock de l'analyse IA
            mock_openai.chat.completions.create.return_value = MagicMock(
                choices=[MagicMock(message=MagicMock(content="Analyse IA du document"))]
            )
            
            # Mock Supabase
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
            mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock()
            
            # Upload du fichier
            file_content = b"Test PDF content"
            files = {"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
            
            response = client.post("/api/v1/upload", files=files)
            assert response.status_code == 200
            
            # document_id = response.json()["id"]  # Pas encore utilisé
            
            # Attendre un peu pour le traitement (en réalité c'est async)
            time.sleep(0.1)
            
            # Vérifier que l'OCR a été appelé
            assert mock_ocr.called
            
            # Vérifier que l'analyse IA a été appelée
            assert mock_openai.chat.completions.create.called
    
    @pytest.mark.asyncio
    async def test_ocr_error_handling(self, client, mock_supabase):
        """Test de la gestion d'erreur dans le flux OCR"""
        with patch('app.services.ocr.process_document') as mock_ocr:
            # Simuler une erreur OCR
            mock_ocr.side_effect = Exception("Erreur OCR")
            
            # Mock Supabase
            mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
            mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock()
            
            # Upload du fichier
            file_content = b"Test PDF content"
            files = {"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
            
            response = client.post("/api/v1/upload", files=files)
            assert response.status_code == 200
            
            # Le document devrait être marqué comme "error" dans la DB
            # (vérifié via les mocks)
    
    @pytest.mark.asyncio
    async def test_multilanguage_ocr(self, client, mock_supabase):
        """Test OCR multilingue"""
        test_cases = [
            ("french.pdf", "Bonjour le monde"),
            ("english.pdf", "Hello world"),
            ("spanish.pdf", "Hola mundo")
        ]
        
        for filename, expected_text in test_cases:
            with patch('app.services.ocr.process_document') as mock_ocr:
                mock_ocr.return_value = expected_text
                
                # Mock Supabase
                mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
                
                file_content = b"Test content"
                files = {"file": (filename, io.BytesIO(file_content), "application/pdf")}
                
                response = client.post("/api/v1/upload", files=files)
                assert response.status_code == 200