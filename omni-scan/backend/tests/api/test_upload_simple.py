"""Tests pour l'API upload simple"""

from fastapi import status
import io


def test_upload_success_txt(client, test_files):
    """Test upload réussi d'un fichier texte"""
    with open(test_files["txt"], "rb") as f:
        response = client.post(
            "/api/v1/upload/simple",
            files={"file": ("test.txt", f, "text/plain")},
            data={
                "detail_level": "medium",
                "include_structured_data": "true"
            }
        )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert data["success"] is True
    assert data["filename"] == "test.txt"
    assert "extracted_text" in data
    assert "ai_analysis" in data
    assert len(data["extracted_text"]) > 0


def test_upload_invalid_format(client, test_files):
    """Test upload avec format non supporté"""
    with open(test_files["bin"], "rb") as f:
        response = client.post(
            "/api/v1/upload/simple",
            files={"file": ("test.bin", f, "application/octet-stream")}
        )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "error" in data
    assert "FILE_VALIDATION_ERROR" in data["error"]["code"]


def test_upload_file_too_large(client, test_files):
    """Test upload avec fichier trop gros"""
    with open(test_files["large"], "rb") as f:
        response = client.post(
            "/api/v1/upload/simple",
            files={"file": ("large.txt", f, "text/plain")}
        )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "error" in data
    assert "trop volumineux" in data["error"]["message"].lower()


def test_upload_no_file(client):
    """Test upload sans fichier"""
    response = client.post("/api/v1/upload/simple")
    
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_upload_empty_filename(client):
    """Test upload avec nom de fichier vide"""
    file_data = io.BytesIO(b"Test content")
    response = client.post(
        "/api/v1/upload/simple",
        files={"file": ("", file_data, "text/plain")}
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "error" in data
    assert "nom de fichier" in data["error"]["message"].lower()


def test_upload_with_options(client, test_files):
    """Test upload avec options d'analyse"""
    with open(test_files["txt"], "rb") as f:
        response = client.post(
            "/api/v1/upload/simple",
            files={"file": ("test.txt", f, "text/plain")},
            data={
                "detail_level": "detailed",
                "language": "fr",
                "include_structured_data": "false",
                "chapter_summaries": "true"
            }
        )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert data["success"] is True
    # Vérifier que les options ont été prises en compte
    assert "ai_analysis" in data


def test_upload_with_custom_ai_provider(client, test_files):
    """Test upload avec provider IA personnalisé"""
    with open(test_files["txt"], "rb") as f:
        response = client.post(
            "/api/v1/upload/simple",
            files={"file": ("test.txt", f, "text/plain")},
            headers={
                "X-AI-Provider": "openai",
                "X-AI-Key": "test-custom-key"
            }
        )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True