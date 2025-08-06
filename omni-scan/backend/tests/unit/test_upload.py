"""Tests unitaires pour les endpoints d'upload"""

import pytest
from unittest.mock import MagicMock
import io


class TestUploadEndpoints:
    """Tests des endpoints d'upload de documents"""
    
    @pytest.mark.asyncio
    async def test_upload_without_auth(self, client, mock_supabase):
        """Test upload sans authentification"""
        # Préparer le fichier de test
        file_content = b"Test PDF content"
        files = {"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
        
        # Mock Supabase
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
        
        # Faire l'upload
        response = client.post("/api/v1/upload", files=files)
        
        assert response.status_code == 202  # Le endpoint retourne 202 Accepted
        data = response.json()
        assert "id" in data
        assert data["filename"] == "test.pdf"
        assert data["status"] == "processing"
    
    @pytest.mark.asyncio
    async def test_upload_with_user_under_quota(self, client, mock_supabase, sample_user):
        """Test upload avec utilisateur sous le quota"""
        # Mock du profil utilisateur
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [sample_user]
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
        
        # Préparer le fichier
        file_content = b"Test PDF content"
        files = {"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
        
        # Upload avec user_id
        response = client.post(
            "/api/v1/upload",
            files=files,
            params={"user_id": sample_user["id"]}
        )
        
        assert response.status_code == 202  # Le endpoint retourne 202 Accepted
        data = response.json()
        assert data["status"] == "processing"
    
    @pytest.mark.asyncio
    async def test_upload_quota_exceeded(self, client, mock_supabase):
        """Test upload avec quota dépassé"""
        # Mock utilisateur avec quota dépassé
        user_over_quota = {
            "id": "test-user-over",
            "documents_used": 5,
            "documents_quota": 5
        }
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [user_over_quota]
        
        # Préparer le fichier
        file_content = b"Test PDF content"
        files = {"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
        
        # Tenter l'upload
        response = client.post(
            "/api/v1/upload",
            files=files,
            params={"user_id": user_over_quota["id"]}
        )
        
        assert response.status_code == 403
        assert "quota" in response.json()["detail"].lower()
    
    def test_upload_invalid_file_type(self, client):
        """Test upload avec type de fichier non supporté"""
        file_content = b"Test EXE content"
        files = {"file": ("test.exe", io.BytesIO(file_content), "application/x-msdownload")}
        
        response = client.post("/api/v1/upload", files=files)
        
        assert response.status_code == 400
        assert "format non supporté" in response.json()["detail"].lower()
    
    def test_upload_file_too_large(self, client):
        """Test upload avec fichier trop volumineux"""
        # Créer un fichier de 11MB (limite est 10MB)
        large_content = b"x" * (11 * 1024 * 1024)
        files = {"file": ("large.pdf", io.BytesIO(large_content), "application/pdf")}
        
        response = client.post("/api/v1/upload", files=files)
        
        assert response.status_code == 413  # Request Entity Too Large
        assert "trop volumineux" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_get_document_success(self, client, mock_supabase, sample_document):
        """Test récupération d'un document existant"""
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [sample_document]
        
        response = client.get(f"/api/v1/documents/{sample_document['id']}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_document["id"]
        assert data["filename"] == sample_document["filename"]
    
    def test_get_document_not_found(self, client, mock_supabase):
        """Test récupération d'un document inexistant"""
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        
        response = client.get("/api/v1/documents/non-existent-id")
        
        assert response.status_code == 404
        assert "non trouvé" in response.json()["detail"].lower()