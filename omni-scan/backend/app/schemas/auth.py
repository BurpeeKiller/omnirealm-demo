"""Schémas Pydantic pour l'authentification"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime
from app.core.validators import validate_password_strength


class UserRegister(BaseModel):
    """Schéma pour l'inscription d'un utilisateur"""
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=100,
        description="Mot de passe (8-100 caractères, majuscule + minuscule + chiffre requis)"
    )

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Valider la force du mot de passe"""
        try:
            return validate_password_strength(v)
        except ValueError as e:
            raise ValueError(str(e))

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }
    )


class UserLogin(BaseModel):
    """Schéma pour la connexion d'un utilisateur"""
    email: EmailStr
    password: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }
    )


class UserResponse(BaseModel):
    """Schéma de réponse pour un utilisateur"""
    id: str
    email: EmailStr
    created_at: Optional[datetime] = None
    subscription_tier: str = "free"
    documents_used: int = 0
    documents_quota: int = 5

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Schéma de réponse pour un token d'authentification"""
    access_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    user: Optional[UserResponse] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 3600,
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "subscription_tier": "free",
                    "documents_used": 2,
                    "documents_quota": 5
                }
            }
        }
    )


class MessageResponse(BaseModel):
    """Schéma de réponse pour un message simple"""
    message: str
    details: Optional[str] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Opération réussie",
                "details": "L'utilisateur a été créé avec succès"
            }
        }
    )