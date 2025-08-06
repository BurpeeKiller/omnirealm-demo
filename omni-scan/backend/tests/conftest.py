"""Configuration globale des tests pytest"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import os
import tempfile

# Configurer les variables d'environnement pour les tests
os.environ["ENVIRONMENT"] = "test"
os.environ["SUPABASE_URL"] = "http://localhost:54321"
os.environ["SUPABASE_ANON_KEY"] = "test-anon-key"
os.environ["OPENAI_API_KEY"] = "test-openai-key"

from app.main import app


@pytest.fixture
def client():
    """Client de test FastAPI"""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def mock_supabase():
    """Mock du client Supabase"""
    with patch("app.core.database.get_supabase") as mock:
        mock_client = MagicMock()
        mock.return_value = mock_client
        yield mock_client


@pytest.fixture
def mock_openai():
    """Mock du client OpenAI"""
    with patch("app.services.ai_analysis.openai.ChatCompletion.acreate") as mock:
        # Mock de la réponse OpenAI
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = '{"summary": "Test summary", "key_points": ["Point 1"], "entities": [], "language": "fr"}'
        mock.return_value = mock_response
        yield mock


@pytest.fixture
def temp_upload_file():
    """Créer un fichier temporaire pour les tests d'upload"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write("Test content for OCR")
        temp_path = f.name
    
    yield temp_path
    
    # Cleanup
    if os.path.exists(temp_path):
        os.unlink(temp_path)


@pytest.fixture
def sample_user():
    """Données utilisateur de test"""
    return {
        "id": "test-user-123",
        "email": "test@example.com",
        "documents_used": 2,
        "documents_quota": 5,
        "subscription_tier": "free"
    }


@pytest.fixture
def sample_document():
    """Données document de test"""
    return {
        "id": "test-doc-456",
        "filename": "test-document.pdf",
        "file_type": "pdf",
        "file_size": 1024,
        "status": "processing",
        "user_id": "test-user-123",
        "extracted_text": None,
        "ai_analysis": None
    }