"""Tests unitaires pour les endpoints de santé"""



class TestHealthEndpoints:
    """Tests des endpoints de santé de l'API"""
    
    def test_root_endpoint(self, client):
        """Test de l'endpoint racine"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "OmniScan"
        assert data["status"] == "running"
        assert "version" in data
        assert data["docs"] == "/docs"
    
    def test_health_check(self, client):
        """Test de l'endpoint de health check"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
    
    def test_openapi_docs(self, client):
        """Test de l'accès à la documentation OpenAPI"""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "swagger" in response.text.lower()
    
    def test_redoc_docs(self, client):
        """Test de l'accès à la documentation ReDoc"""
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "redoc" in response.text.lower()