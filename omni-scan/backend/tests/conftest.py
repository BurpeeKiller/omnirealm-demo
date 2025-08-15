"""Configuration des tests pour OmniScan"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
import tempfile
import os

@pytest.fixture
def client():
    """Client de test FastAPI"""
    return TestClient(app)


@pytest.fixture
def temp_dir():
    """Répertoire temporaire pour les tests"""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield tmpdir


@pytest.fixture
def test_files(temp_dir):
    """Fichiers de test"""
    files = {}
    
    # Fichier texte simple
    txt_path = os.path.join(temp_dir, "test.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("Ceci est un test de document pour l'OCR.")
    files["txt"] = txt_path
    
    # Fichier image (placeholder)
    png_path = os.path.join(temp_dir, "test.png")
    # Créer un fichier PNG minimal (1x1 pixel transparent)
    png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05W\xb6\x82\x00\x00\x00\x00IEND\xaeB`\x82'
    with open(png_path, "wb") as f:
        f.write(png_data)
    files["png"] = png_path
    
    # Fichier non supporté
    bin_path = os.path.join(temp_dir, "test.bin")
    with open(bin_path, "wb") as f:
        f.write(b"Binary content")
    files["bin"] = bin_path
    
    # Gros fichier
    large_path = os.path.join(temp_dir, "large.txt")
    with open(large_path, "w", encoding="utf-8") as f:
        f.write("X" * (11 * 1024 * 1024))  # 11MB
    files["large"] = large_path
    
    return files


@pytest.fixture
def mock_env(monkeypatch):
    """Mock des variables d'environnement"""
    monkeypatch.setenv("ENVIRONMENT", "testing")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key")
    monkeypatch.setenv("OPENAI_API_KEY", "test-api-key")
    monkeypatch.setenv("SUPABASE_URL", "http://localhost:54321")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "test-anon-key")