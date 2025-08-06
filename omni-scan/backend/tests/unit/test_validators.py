"""Tests unitaires pour les validateurs"""

import pytest
from app.core.validators import (
    validate_password_strength,
    validate_file_extension,
    validate_file_size,
    sanitize_filename
)
from app.schemas.auth import UserRegister
from pydantic import ValidationError


class TestPasswordValidator:
    """Tests du validateur de mot de passe"""
    
    def test_valid_password(self):
        """Test avec un mot de passe valide"""
        password = "SecurePass123!"
        result = validate_password_strength(password)
        assert result == password
    
    def test_password_too_short(self):
        """Test avec un mot de passe trop court"""
        with pytest.raises(ValueError, match="au moins 8 caractères"):
            validate_password_strength("Pass1!")
    
    def test_password_no_uppercase(self):
        """Test sans lettre majuscule"""
        with pytest.raises(ValueError, match="lettre majuscule"):
            validate_password_strength("securepass123!")
    
    def test_password_no_lowercase(self):
        """Test sans lettre minuscule"""
        with pytest.raises(ValueError, match="lettre minuscule"):
            validate_password_strength("SECUREPASS123!")
    
    def test_password_no_digit(self):
        """Test sans chiffre"""
        with pytest.raises(ValueError, match="au moins un chiffre"):
            validate_password_strength("SecurePass!")
    
    def test_password_without_special_char(self):
        """Test sans caractère spécial (doit passer)"""
        password = "SecurePass123"
        result = validate_password_strength(password)
        assert result == password


class TestFileValidators:
    """Tests des validateurs de fichiers"""
    
    def test_valid_file_extension(self):
        """Test avec une extension valide"""
        allowed = {"pdf", "jpg", "png"}
        result = validate_file_extension("document.pdf", allowed)
        assert result == "pdf"
    
    def test_invalid_file_extension(self):
        """Test avec une extension invalide"""
        allowed = {"pdf", "jpg", "png"}
        with pytest.raises(ValueError, match="Type de fichier non supporté"):
            validate_file_extension("document.exe", allowed)
    
    def test_file_extension_case_insensitive(self):
        """Test avec une extension en majuscules"""
        allowed = {"pdf", "jpg", "png"}
        result = validate_file_extension("document.PDF", allowed)
        assert result == "pdf"
    
    def test_valid_file_size(self):
        """Test avec une taille valide"""
        size = 5 * 1024 * 1024  # 5MB
        result = validate_file_size(size, max_size_mb=10)
        assert result == size
    
    def test_file_too_large(self):
        """Test avec un fichier trop gros"""
        size = 15 * 1024 * 1024  # 15MB
        with pytest.raises(ValueError, match="trop volumineux"):
            validate_file_size(size, max_size_mb=10)
    
    def test_empty_file(self):
        """Test avec un fichier vide"""
        with pytest.raises(ValueError, match="fichier est vide"):
            validate_file_size(0, max_size_mb=10)


class TestFilenameSanitizer:
    """Tests du nettoyeur de noms de fichiers"""
    
    def test_clean_filename(self):
        """Test avec un nom propre"""
        result = sanitize_filename("document.pdf")
        assert result == "document.pdf"
    
    def test_filename_with_spaces(self):
        """Test avec des espaces"""
        result = sanitize_filename("my document.pdf")
        assert result == "my_document.pdf"
    
    def test_filename_with_special_chars(self):
        """Test avec des caractères spéciaux"""
        result = sanitize_filename("doc@#$%^&*.pdf")
        assert result == "doc_______.pdf"
    
    def test_filename_double_dots(self):
        """Test avec des doubles points"""
        result = sanitize_filename("doc..pdf")
        assert result == "doc.pdf"
    
    def test_long_filename(self):
        """Test avec un nom très long"""
        long_name = "a" * 300 + ".pdf"
        result = sanitize_filename(long_name)
        assert len(result) <= 255
        assert result.endswith(".pdf")


class TestPydanticIntegration:
    """Tests de l'intégration avec Pydantic"""
    
    def test_user_register_valid(self):
        """Test d'inscription avec des données valides"""
        user = UserRegister(
            email="test@example.com",
            password="SecurePass123!"
        )
        assert user.email == "test@example.com"
        assert user.password == "SecurePass123!"
    
    def test_user_register_weak_password(self):
        """Test d'inscription avec un mot de passe faible"""
        with pytest.raises(ValidationError) as exc_info:
            UserRegister(
                email="test@example.com",
                password="weak"
            )
        errors = exc_info.value.errors()
        # Vérifier qu'il y a une erreur sur le champ password
        assert any(error['loc'] == ('password',) for error in errors)
        # Le message peut être soit de Pydantic (min_length) soit du validateur custom
        error_messages = [str(error) for error in errors]
        assert any("at least 8 characters" in msg or "8 caractères" in msg for msg in error_messages)
    
    def test_user_register_invalid_email(self):
        """Test d'inscription avec un email invalide"""
        with pytest.raises(ValidationError) as exc_info:
            UserRegister(
                email="not-an-email",
                password="SecurePass123!"
            )
        errors = exc_info.value.errors()
        assert any("email" in str(error).lower() for error in errors)