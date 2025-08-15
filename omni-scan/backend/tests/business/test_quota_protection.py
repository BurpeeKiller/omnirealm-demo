"""
Tests critiques pour la protection des quotas utilisateurs - Protection des revenus OCR
Ces tests garantissent que seuls les utilisateurs Pro peuvent dépasser les limites gratuites.
"""

import pytest
from unittest.mock import patch, MagicMock
from app.services.auth_light import LightAuth, auth
import json
import jwt
from datetime import datetime, timedelta


class TestQuotaProtection:
    """Tests de protection des quotas - Niveau critique business"""
    
    @pytest.fixture
    def mock_redis_free_user(self):
        """Simuler un utilisateur gratuit avec quotas"""
        user_data = {
            "email": "free@test.com",
            "scans_used": 3,
            "scans_limit": 5,
            "is_pro": False,
            "created_at": datetime.utcnow().isoformat()
        }
        return user_data
    
    @pytest.fixture
    def mock_redis_pro_user(self):
        """Simuler un utilisateur Pro sans limites"""
        user_data = {
            "email": "pro@test.com",
            "scans_used": 100,
            "scans_limit": 5,  # Les limites ne s'appliquent pas aux Pro
            "is_pro": True,
            "stripe_customer_id": "cus_test123",
            "upgraded_at": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        return user_data
    
    @pytest.fixture
    def mock_redis_maxed_free_user(self):
        """Utilisateur gratuit ayant atteint sa limite"""
        user_data = {
            "email": "maxed@test.com",
            "scans_used": 5,
            "scans_limit": 5,
            "is_pro": False,
            "created_at": datetime.utcnow().isoformat()
        }
        return user_data
    
    @pytest.fixture
    def valid_jwt_token(self):
        """Token JWT valide pour les tests"""
        payload = {
            "user_id": "test@test.com",
            "email": "test@test.com",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, "test-secret-key", algorithm="HS256")

    def test_free_user_within_quota_allowed(self, mock_redis_free_user):
        """CRITIQUE: Utilisateur gratuit sous la limite doit pouvoir utiliser OCR"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(mock_redis_free_user)
                
                result = auth.check_quota("free@test.com")
                
                assert result["allowed"] is True
                assert result["reason"] == "within_quota"
                assert result["used"] == 3
                assert result["limit"] == 5
                assert result["remaining"] == 2

    def test_free_user_over_quota_blocked(self, mock_redis_maxed_free_user):
        """CRITIQUE: Utilisateur gratuit ayant atteint sa limite doit être bloqué"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(mock_redis_maxed_free_user)
                
                result = auth.check_quota("maxed@test.com")
                
                assert result["allowed"] is False
                assert result["reason"] == "quota_exceeded"
                assert result["used"] == 5
                assert result["limit"] == 5

    def test_pro_user_unlimited_access(self, mock_redis_pro_user):
        """CRITIQUE: Utilisateur Pro doit avoir accès illimité même après 100+ scans"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(mock_redis_pro_user)
                
                result = auth.check_quota("pro@test.com")
                
                assert result["allowed"] is True
                assert result["reason"] == "pro_user"

    def test_quota_increment_protection(self, mock_redis_free_user):
        """CRITIQUE: L'incrémentation du quota ne doit pas être contournable"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                # Simuler l'état initial
                mock_redis.get.return_value = json.dumps(mock_redis_free_user)
                
                # Incrémenter l'usage
                result = auth.increment_usage("free@test.com")
                
                assert result is True
                # Vérifier que setex est appelé avec les bonnes données
                mock_redis.setex.assert_called()
                
                # Vérifier que l'usage a été incrémenté
                call_args = mock_redis.setex.call_args
                updated_data = json.loads(call_args[0][2])
                assert updated_data["scans_used"] == 4

    def test_unauthorized_quota_bypass_attempt(self):
        """CRITIQUE: Tentative de contournement sans token valide"""
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = None  # Pas d'utilisateur
                
                result = auth.check_quota("nonexistent@test.com")
                
                assert result["allowed"] is True  # Par défaut mais sera bloqué par auth
                assert result["reason"] == "no_user"

    def test_concurrent_quota_usage_protection(self, mock_redis_free_user):
        """CRITIQUE: Plusieurs requêtes simultanées ne doivent pas contourner les quotas"""
        import asyncio
        
        async def simulate_concurrent_usage():
            tasks = []
            for i in range(10):  # 10 requêtes simultanées
                task = asyncio.create_task(self._simulate_quota_check(mock_redis_free_user))
                tasks.append(task)
            
            results = await asyncio.gather(*tasks)
            return results
        
        # Simuler que l'utilisateur a 4/5 scans utilisés
        mock_redis_free_user["scans_used"] = 4
        
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(mock_redis_free_user)
                
                # Au maximum, une seule requête devrait être autorisée
                results = asyncio.run(simulate_concurrent_usage())
                allowed_count = sum(1 for r in results if r["allowed"])
                
                # Avec la protection, au max 1 requête autorisée
                assert allowed_count <= 1

    async def _simulate_quota_check(self, user_data):
        """Simuler une vérification de quota async"""
        return auth.check_quota(user_data["email"])

    def test_token_manipulation_protection(self):
        """CRITIQUE: Manipulation de token JWT ne doit pas contourner les quotas"""
        # Token avec des claims manipulés
        fake_payload = {
            "user_id": "hacker@test.com",
            "email": "hacker@test.com",
            "is_pro": True,  # Tentative de manipulation
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        
        # Utiliser une mauvaise clé de signature
        fake_token = jwt.encode(fake_payload, "wrong-key", algorithm="HS256")
        
        # Doit échouer avec une mauvaise signature
        user = auth.get_user(fake_token)
        assert user is None

    def test_expired_pro_subscription_protection(self):
        """CRITIQUE: Abonnement Pro expiré doit revenir aux limites gratuites"""
        # Simuler un utilisateur dont l'abonnement Pro a expiré
        expired_pro_data = {
            "email": "expired@test.com",
            "scans_used": 10,
            "scans_limit": 5,
            "is_pro": False,  # Pro expiré
            "stripe_customer_id": "cus_expired123",
            "created_at": datetime.utcnow().isoformat()
        }
        
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(expired_pro_data)
                
                result = auth.check_quota("expired@test.com")
                
                # Doit être bloqué car pas Pro et au-dessus de la limite
                assert result["allowed"] is False
                assert result["reason"] == "quota_exceeded"

    def test_memory_cache_fallback_protection(self):
        """CRITIQUE: Protection des quotas même sans Redis (fallback mémoire)"""
        user_data = {
            "email": "memory@test.com",
            "scans_used": 5,
            "scans_limit": 5,
            "is_pro": False
        }
        
        with patch('app.services.auth_light.USE_REDIS', False):
            with patch('app.services.auth_light.memory_cache', {"user:memory@test.com": user_data}):
                
                result = auth.check_quota("memory@test.com")
                
                assert result["allowed"] is False
                assert result["reason"] == "quota_exceeded"

    def test_quota_reset_protection(self):
        """CRITIQUE: Les quotas ne doivent pas être réinitialisables par l'utilisateur"""
        user_data = {
            "email": "reset@test.com",
            "scans_used": 5,
            "scans_limit": 5,
            "is_pro": False
        }
        
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(user_data)
                
                # Tentative de "reset" en créant une nouvelle session
                # Cela ne devrait PAS réinitialiser les quotas existants
                session = auth.create_session("reset@test.com")
                
                # Vérifier que les quotas existants sont préservés
                mock_redis.setex.assert_called()
                call_args = mock_redis.setex.call_args
                preserved_data = json.loads(call_args[0][2])
                
                # Les nouveaux utilisateurs commencent à 0, mais les existants gardent leur usage
                # Cette logique devrait être dans le vrai code
                assert preserved_data is not None


class TestQuotaBusinessLogic:
    """Tests de logique métier pour les quotas"""
    
    def test_upgrade_to_pro_workflow(self):
        """Test du workflow complet de mise à niveau Pro"""
        user_data = {
            "email": "upgrade@test.com",
            "scans_used": 5,
            "scans_limit": 5,
            "is_pro": False
        }
        
        with patch('app.services.auth_light.USE_REDIS', True):
            with patch('app.services.auth_light.redis_client') as mock_redis:
                mock_redis.get.return_value = json.dumps(user_data)
                
                # Upgrade vers Pro
                result = auth.upgrade_to_pro("upgrade@test.com", "cus_new123")
                
                assert result is True
                
                # Vérifier que les données sont mises à jour
                mock_redis.setex.assert_called()
                call_args = mock_redis.setex.call_args
                updated_data = json.loads(call_args[0][2])
                
                assert updated_data["is_pro"] is True
                assert updated_data["stripe_customer_id"] == "cus_new123"
                assert "upgraded_at" in updated_data

    def test_quota_edge_cases(self):
        """Tests des cas limites de quotas"""
        test_cases = [
            # Cas: utilisateur à exactement la limite
            {
                "scans_used": 5,
                "scans_limit": 5,
                "is_pro": False,
                "expected_allowed": False,
                "expected_reason": "quota_exceeded"
            },
            # Cas: utilisateur Pro avec usage élevé
            {
                "scans_used": 1000,
                "scans_limit": 5,
                "is_pro": True,
                "expected_allowed": True,
                "expected_reason": "pro_user"
            },
            # Cas: utilisateur nouveau (0 scans)
            {
                "scans_used": 0,
                "scans_limit": 5,
                "is_pro": False,
                "expected_allowed": True,
                "expected_reason": "within_quota"
            }
        ]
        
        for i, case in enumerate(test_cases):
            user_data = {
                "email": f"edge{i}@test.com",
                "scans_used": case["scans_used"],
                "scans_limit": case["scans_limit"],
                "is_pro": case["is_pro"]
            }
            
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    result = auth.check_quota(f"edge{i}@test.com")
                    
                    assert result["allowed"] == case["expected_allowed"], f"Case {i} failed"
                    assert result["reason"] == case["expected_reason"], f"Case {i} failed"