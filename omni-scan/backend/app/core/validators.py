"""Validateurs personnalisés pour l'application"""

import re
from pydantic import field_validator


def validate_password_strength(password: str) -> str:
    """
    Valider la force d'un mot de passe.
    
    Règles:
    - Au moins 8 caractères
    - Au moins une lettre majuscule
    - Au moins une lettre minuscule
    - Au moins un chiffre
    - Au moins un caractère spécial (optionnel mais recommandé)
    """
    if len(password) < 8:
        raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
    
    if not re.search(r"[A-Z]", password):
        raise ValueError("Le mot de passe doit contenir au moins une lettre majuscule")
    
    if not re.search(r"[a-z]", password):
        raise ValueError("Le mot de passe doit contenir au moins une lettre minuscule")
    
    if not re.search(r"\d", password):
        raise ValueError("Le mot de passe doit contenir au moins un chiffre")
    
    # Avertissement si pas de caractère spécial (mais pas bloquant)
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        # On pourrait logger un avertissement ici
        pass
    
    return password


def validate_file_extension(filename: str, allowed_extensions: set[str]) -> str:
    """
    Valider l'extension d'un fichier.
    
    Args:
        filename: Nom du fichier
        allowed_extensions: Extensions autorisées
        
    Returns:
        Extension du fichier en minuscules
        
    Raises:
        ValueError: Si l'extension n'est pas autorisée
    """
    if not filename or "." not in filename:
        raise ValueError("Nom de fichier invalide")
    
    extension = filename.split(".")[-1].lower()
    
    if extension not in allowed_extensions:
        raise ValueError(
            f"Type de fichier non supporté. Extensions autorisées: {', '.join(allowed_extensions)}"
        )
    
    return extension


def validate_file_size(size_bytes: int, max_size_mb: int) -> int:
    """
    Valider la taille d'un fichier.
    
    Args:
        size_bytes: Taille en octets
        max_size_mb: Taille maximum en MB
        
    Returns:
        Taille en octets
        
    Raises:
        ValueError: Si le fichier est trop gros
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    
    if size_bytes > max_size_bytes:
        raise ValueError(f"Fichier trop volumineux. Maximum: {max_size_mb}MB")
    
    if size_bytes == 0:
        raise ValueError("Le fichier est vide")
    
    return size_bytes


def sanitize_filename(filename: str) -> str:
    """
    Nettoyer un nom de fichier pour éviter les problèmes de sécurité.
    
    Args:
        filename: Nom du fichier original
        
    Returns:
        Nom de fichier nettoyé
    """
    # Garder seulement les caractères alphanumériques, points, tirets et underscores
    clean_name = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Éviter les doubles points
    clean_name = re.sub(r'\.{2,}', '.', clean_name)
    
    # Limiter la longueur
    if len(clean_name) > 255:
        extension = clean_name.split('.')[-1] if '.' in clean_name else ''
        base_name = clean_name[:240]
        clean_name = f"{base_name}.{extension}" if extension else base_name
    
    return clean_name


class PasswordValidator:
    """Validateur de mot de passe pour les schémas Pydantic"""
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        try:
            return validate_password_strength(v)
        except ValueError as e:
            raise ValueError(str(e))