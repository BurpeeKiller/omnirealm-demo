"""Tests unitaires pour les endpoints d'authentification"""

from unittest.mock import MagicMock


class TestAuthEndpoints:
    """Tests des endpoints d'authentification"""
    
    def test_register_success(self, client, mock_supabase):
        """Test inscription réussie"""
        # Mock Supabase auth
        mock_auth_response = MagicMock()
        mock_auth_response.user = MagicMock(id="new-user-id")
        mock_supabase.auth.sign_up.return_value = mock_auth_response
        
        # Mock création du profil
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
        
        # Données d'inscription
        register_data = {
            "email": "newuser@example.com",
            "password": "SecurePass123!"
        }
        
        response = client.post("/api/v1/auth/register", json=register_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert data["message"] == "Inscription réussie"
    
    def test_register_duplicate_email(self, client, mock_supabase):
        """Test inscription avec email déjà utilisé"""
        # Mock erreur Supabase
        mock_supabase.auth.sign_up.side_effect = Exception("User already registered")
        
        register_data = {
            "email": "existing@example.com",
            "password": "SecurePass123!"
        }
        
        response = client.post("/api/v1/auth/register", json=register_data)
        
        assert response.status_code == 400
        assert "erreur" in response.json()["detail"].lower()
    
    def test_login_success(self, client, mock_supabase):
        """Test connexion réussie"""
        # Mock Supabase auth
        mock_session = MagicMock()
        mock_session.access_token = "test-access-token"
        mock_session.user = MagicMock(id="user-123", email="user@example.com")
        
        mock_auth_response = MagicMock()
        mock_auth_response.session = mock_session
        mock_supabase.auth.sign_in_with_password.return_value = mock_auth_response
        
        login_data = {
            "email": "user@example.com",
            "password": "SecurePass123!"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "test-access-token"
        assert data["token_type"] == "bearer"
        assert "user" in data
    
    def test_login_invalid_credentials(self, client, mock_supabase):
        """Test connexion avec identifiants invalides"""
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")
        
        login_data = {
            "email": "user@example.com",
            "password": "WrongPassword"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "identifiants invalides" in response.json()["detail"].lower()
    
    def test_logout_success(self, client, mock_supabase):
        """Test déconnexion réussie"""
        mock_supabase.auth.sign_out.return_value = None
        
        response = client.post("/api/v1/auth/logout")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Déconnexion réussie"
    
    def test_validate_email_format(self, client):
        """Test validation du format email"""
        invalid_emails = [
            "notanemail",
            "@example.com",
            "user@",
            "user@.com",
            "user..name@example.com"
        ]
        
        for email in invalid_emails:
            response = client.post("/api/v1/auth/register", json={
                "email": email,
                "password": "SecurePass123!"
            })
            assert response.status_code == 422  # Validation error
    
    def test_validate_password_strength(self, client):
        """Test validation de la force du mot de passe"""
        weak_passwords = [
            "123456",      # Trop court
            "password",    # Trop simple
            "12345678",    # Pas de lettres
            "abcdefgh"     # Pas de chiffres
        ]
        
        for password in weak_passwords:
            response = client.post("/api/v1/auth/register", json={
                "email": "user@example.com",
                "password": password
            })
            # Dépend de la validation implémentée
            assert response.status_code in [400, 422]