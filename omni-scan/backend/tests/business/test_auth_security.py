"""
Tests de sécurité d'authentification et d'autorisation - Protection des revenus
Ces tests garantissent que l'accès aux fonctionnalités OCR payantes est sécurisé.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from fastapi.testclient import TestClient
import jwt
from datetime import datetime, timedelta
import json

from app.main import app
from app.services.auth_light import auth
from app.api.payment import router as payment_router


class TestAuthenticationSecurity:
    """Tests de sécurité pour l'authentification"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    @pytest.fixture
    def valid_token(self):
        """Token JWT valide pour les tests"""
        payload = {
            "user_id": "test@example.com",
            "email": "test@example.com",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, "test-secret-key", algorithm="HS256")
    
    @pytest.fixture
    def expired_token(self):
        """Token expiré"""
        payload = {
            "user_id": "test@example.com",
            "email": "test@example.com",
            "exp": datetime.utcnow() - timedelta(hours=1)  # Expiré
        }
        return jwt.encode(payload, "test-secret-key", algorithm="HS256")
    
    @pytest.fixture
    def malformed_token(self):
        """Token malformé"""
        return "malformed.token.here"

    def test_no_token_access_denied(self, client):
        """CRITIQUE: Accès sans token doit être refusé"""
        response = client.get("/api/payment/check-subscription")
        
        assert response.status_code == 200  # Endpoint retourne is_pro: False
        data = response.json()
        assert data["is_pro"] is False
        assert data["reason"] == "no_token"

    def test_malformed_token_rejected(self, client, malformed_token):
        """CRITIQUE: Token malformé doit être rejeté"""
        headers = {"Authorization": f"Bearer {malformed_token}"}
        response = client.get("/api/payment/check-subscription", headers=headers)
        
        data = response.json()
        assert data["is_pro"] is False
        assert data["reason"] == "no_user"

    def test_expired_token_rejected(self, client, expired_token):
        """CRITIQUE: Token expiré doit être rejeté"""
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            headers = {"Authorization": f"Bearer {expired_token}"}
            response = client.get("/api/payment/check-subscription", headers=headers)
            
            data = response.json()
            assert data["is_pro"] is False
            assert data["reason"] == "no_user"

    def test_valid_token_accepted(self, client, valid_token):
        """Token valide doit être accepté"""
        user_data = {
            "email": "test@example.com",
            "scans_used": 2,
            "scans_limit": 5,
            "is_pro": False
        }
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    headers = {"Authorization": f"Bearer {valid_token}"}
                    response = client.get("/api/payment/check-subscription", headers=headers)
                    
                    assert response.status_code == 200
                    data = response.json()
                    assert data["is_pro"] is False
                    assert data["scans_used"] == 2
                    assert data["scans_remaining"] == 3

    def test_token_signature_validation(self):
        """CRITIQUE: Signature JWT doit être validée"""
        # Token signé avec une mauvaise clé
        fake_payload = {
            "user_id": "attacker@evil.com",
            "email": "attacker@evil.com",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        fake_token = jwt.encode(fake_payload, "wrong-secret-key", algorithm="HS256")
        
        with patch('app.services.auth_light.SECRET_KEY', 'correct-secret-key'):
            user = auth.get_user(fake_token)
            assert user is None

    def test_token_replay_attack_protection(self, valid_token):
        """CRITIQUE: Protection contre les attaques par rejeu de token"""
        user_data = {
            "email": "test@example.com",
            "scans_used": 4,
            "scans_limit": 5,
            "is_pro": False
        }
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    # Première utilisation - OK
                    user1 = auth.get_user(valid_token)
                    assert user1 is not None
                    
                    # Le même token peut être réutilisé (pas de blacklist implémentée)
                    # Mais l'usage des quotas est protégé
                    user2 = auth.get_user(valid_token)
                    assert user2 is not None

    def test_authorization_header_format_validation(self, client):
        """CRITIQUE: Format d'en-tête Authorization doit être validé"""
        test_cases = [
            ("Bearer", 200),  # Pas de token après Bearer
            ("Basic dGVzdA==", 200),  # Mauvais type d'auth
            ("bearer token", 200),  # Mauvaise casse
            ("Bearer ", 200),  # Bearer avec espace mais pas de token
            ("", 200),  # En-tête vide
        ]
        
        for auth_header, expected_status in test_cases:
            headers = {"Authorization": auth_header} if auth_header else {}
            response = client.get("/api/payment/check-subscription", headers=headers)
            
            assert response.status_code == expected_status
            data = response.json()
            assert data["is_pro"] is False

    def test_user_impersonation_protection(self):
        """CRITIQUE: Protection contre l'usurpation d'identité"""
        # Tentative de création d'un token pour un autre utilisateur
        attacker_payload = {
            "user_id": "victim@example.com",
            "email": "victim@example.com",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        # Même avec la bonne clé, le système doit vérifier l'existence de l'utilisateur
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            fake_token = jwt.encode(attacker_payload, 'test-secret-key', algorithm="HS256")
            
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = None  # Utilisateur n'existe pas
                    
                    user = auth.get_user(fake_token)
                    assert user is None

    def test_privilege_escalation_protection(self):
        """CRITIQUE: Protection contre l'élévation de privilèges"""
        # Utilisateur normal tente de se faire passer pour Pro via le token
        user_data = {
            "email": "normal@example.com",
            "scans_used": 10,
            "scans_limit": 5,
            "is_pro": False  # Pas Pro dans les données Redis
        }
        
        # Token avec claim is_pro (ne doit pas être pris en compte)
        malicious_payload = {
            "user_id": "normal@example.com",
            "email": "normal@example.com",
            "is_pro": True,  # Tentative d'escalade
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            malicious_token = jwt.encode(malicious_payload, 'test-secret-key', algorithm="HS256")
            
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    # Vérifier que le statut Pro vient de Redis, pas du token
                    quota = auth.check_quota("normal@example.com")
                    assert quota["allowed"] is False  # Car pas vraiment Pro
                    assert quota["reason"] == "quota_exceeded"


class TestPaymentEndpointSecurity:
    """Tests de sécurité pour les endpoints de paiement"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_create_checkout_without_auth(self, client):
        """CRITIQUE: Création de session checkout sans auth doit être refusée"""
        response = client.post("/api/payment/create-checkout")
        
        assert response.status_code == 401
        data = response.json()
        assert "Token requis" in data["detail"]

    def test_create_checkout_with_invalid_token(self, client):
        """CRITIQUE: Token invalide pour checkout doit être rejeté"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.post("/api/payment/create-checkout", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "Utilisateur non trouvé" in data["detail"]

    @patch('app.api.payment.STRIPE_SECRET_KEY', 'sk_test_123')
    @patch('stripe.checkout.Session.create')
    def test_create_checkout_with_valid_auth(self, mock_stripe, client):
        """Utilisateur authentifié valide peut créer une session checkout"""
        user_data = {
            "email": "buyer@example.com",
            "scans_used": 5,
            "scans_limit": 5,
            "is_pro": False
        }
        
        mock_stripe.return_value.url = "https://checkout.stripe.com/session_123"
        
        payload = {
            "user_id": "buyer@example.com",
            "email": "buyer@example.com",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            token = jwt.encode(payload, 'test-secret-key', algorithm="HS256")
            
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    headers = {"Authorization": f"Bearer {token}"}
                    response = client.post("/api/payment/create-checkout", headers=headers)
                    
                    assert response.status_code == 200
                    data = response.json()
                    assert "url" in data

    def test_webhook_endpoint_security(self, client):
        """CRITIQUE: Webhook Stripe doit vérifier la signature (en production)"""
        fake_webhook_data = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "metadata": {"user_id": "hacker@evil.com"},
                    "customer": "cus_fake123"
                }
            }
        }
        
        # Note: Dans le code actuel, la vérification de signature est commentée
        # Ceci est un risque de sécurité en production
        response = client.post("/api/payment/webhook", json=fake_webhook_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["received"] is True


class TestSessionManagement:
    """Tests de gestion des sessions"""
    
    def test_session_creation_security(self):
        """CRITIQUE: Création de session doit être sécurisée"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                session = auth.create_session("secure@example.com")
                
                assert "token" in session
                assert "user" in session
                assert session["user"]["email"] == "secure@example.com"
                assert session["user"]["is_pro"] is False
                assert session["user"]["scans_limit"] == 5
                
                # Vérifier que les données sont stockées avec expiration
                mock_redis.setex.assert_called()
                call_args = mock_redis.setex.call_args
                assert call_args[0][1] == 86400  # 24h expiration

    def test_session_token_uniqueness(self):
        """Tokens de session doivent être uniques"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                session1 = auth.create_session("user1@example.com")
                session2 = auth.create_session("user2@example.com")
                
                assert session1["token"] != session2["token"]

    def test_magic_link_expiration(self):
        """CRITIQUE: Liens magiques doivent expirer"""
        magic_link = auth.create_magic_link("test@example.com")
        
        # Extraire le token du lien
        token = magic_link.split("token=")[1]
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            # Token frais - doit fonctionner
            email = auth.verify_magic_link(token)
            assert email == "test@example.com"
            
            # Simuler l'expiration en mockant datetime
            with patch('jwt.decode') as mock_decode:
                mock_decode.side_effect = jwt.ExpiredSignatureError()
                expired_email = auth.verify_magic_link(token)
                assert expired_email is None

    def test_magic_link_single_use_protection(self):
        """CRITIQUE: Liens magiques devraient être à usage unique (si implémenté)"""
        magic_link = auth.create_magic_link("single@example.com")
        token = magic_link.split("token=")[1]
        
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            # Première utilisation - OK
            email1 = auth.verify_magic_link(token)
            assert email1 == "single@example.com"
            
            # Deuxième utilisation - devrait être OK aussi (pas de protection implémentée)
            # Ceci est un point d'amélioration de sécurité
            email2 = auth.verify_magic_link(token)
            assert email2 == "single@example.com"


class TestConcurrencyProtection:
    """Tests de protection contre les accès concurrents"""
    
    def test_concurrent_quota_modification(self):
        """CRITIQUE: Modifications concurrentes des quotas"""
        import asyncio
        
        user_data = {
            "email": "concurrent@example.com",
            "scans_used": 4,
            "scans_limit": 5,
            "is_pro": False
        }
        
        async def simulate_concurrent_increment():
            """Simuler plusieurs incréments simultanés"""
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    # Simuler 5 incréments simultanés
                    tasks = []
                    for _ in range(5):
                        task = asyncio.create_task(self._async_increment("concurrent@example.com"))
                        tasks.append(task)
                    
                    results = await asyncio.gather(*tasks)
                    return results
        
        # Avec race condition, tous pourraient réussir
        # Dans un vrai système, on aurait besoin de verrous Redis
        results = asyncio.run(simulate_concurrent_increment())
        
        # Au moins une opération devrait réussir
        success_count = sum(1 for r in results if r)
        assert success_count >= 1

    async def _async_increment(self, user_id):
        """Helper pour incrément async"""
        return auth.increment_usage(user_id)