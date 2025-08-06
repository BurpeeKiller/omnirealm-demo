"""Configuration centralisée pour OmniScan v2.0"""

from typing import Optional, List, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
import os
from pathlib import Path


class Settings(BaseSettings):
    """Configuration de l'application"""
    
    # Application
    app_name: str = "OmniScan"
    app_version: str = "2.0.0"
    environment: Literal["development", "testing", "production"] = Field(
        default="development", 
        alias="ENVIRONMENT"
    )
    debug: bool = Field(default=True, alias="DEBUG")
    secret_key: str = Field(
        default="dev-secret-key-change-in-production",
        alias="SECRET_KEY",
        description="Clé secrète pour signer les tokens JWT"
    )
    
    # API
    backend_url: str = Field(default="http://localhost:8000", alias="BACKEND_URL")
    api_prefix: str = "/api/v1"
    
    # Supabase
    supabase_url: str = Field(
        default="",
        alias="SUPABASE_URL",
        description="URL de l'instance Supabase"
    )
    supabase_anon_key: str = Field(
        default="",
        alias="SUPABASE_ANON_KEY",
        description="Clé anonyme Supabase (publique)"
    )
    supabase_service_key: Optional[str] = Field(
        default=None,
        alias="SUPABASE_SERVICE_KEY",
        description="Clé de service Supabase (privée)"
    )
    
    # OpenAI
    openai_api_key: str = Field(
        default="",
        alias="OPENAI_API_KEY",
        description="Clé API OpenAI pour l'analyse IA"
    )
    openai_model: str = Field(
        default="gpt-4o-mini", 
        alias="OPENAI_MODEL",
        description="Modèle OpenAI à utiliser"
    )
    
    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        alias="CORS_ORIGINS",
        description="URLs autorisées pour CORS (séparées par des virgules)"
    )
    
    # Upload
    max_file_size_mb: int = Field(default=10, alias="MAX_FILE_SIZE_MB")
    allowed_extensions: set[str] = {"pdf", "jpg", "jpeg", "png", "tiff", "bmp"}
    upload_path: str = Field(default="./uploads", alias="UPLOAD_PATH")
    temp_path: str = Field(default="./temp", alias="TEMP_PATH")
    
    # OCR
    ocr_languages: str = Field(default="fra+eng", alias="OCR_LANGUAGES")
    
    # Rate Limiting
    rate_limit_per_minute: int = Field(
        default=60, 
        alias="RATE_LIMIT_PER_MINUTE",
        description="Limite de requêtes par minute par IP"
    )
    
    # Logging
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO",
        alias="LOG_LEVEL",
        description="Niveau de logging"
    )
    log_format: Literal["json", "simple"] = Field(
        default="json",
        alias="LOG_FORMAT", 
        description="Format des logs"
    )
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",  # Ignorer les variables VITE_*
        populate_by_name=True,
        validate_assignment=True
    )
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parser les CORS_ORIGINS depuis une string séparée par des virgules"""
        if isinstance(v, str):
            return [url.strip() for url in v.split(',') if url.strip()]
        return v
    
    @field_validator('secret_key', mode='after')
    @classmethod
    def validate_secret_key(cls, v, info):
        """Valider la clé secrète en production"""
        if info.data.get('environment') == 'production' and v == 'dev-secret-key-change-in-production':
            raise ValueError('SECRET_KEY must be set to a secure value in production')
        return v
    
    def get_database_url(self) -> str:
        """Construire l'URL de la base de données"""
        if not self.supabase_url:
            return ""
        # Construire l'URL PostgreSQL depuis l'URL Supabase
        return f"{self.supabase_url}/rest/v1/"
    
    def is_production(self) -> bool:
        """Vérifier si on est en production"""
        return self.environment == "production"
    
    def is_testing(self) -> bool:
        """Vérifier si on est en test"""
        return self.environment == "testing" or os.getenv("ENVIRONMENT") == "test"
    
    def get_upload_path(self) -> Path:
        """Obtenir le chemin d'upload comme Path object"""
        return Path(self.upload_path).resolve()
    
    def get_temp_path(self) -> Path:
        """Obtenir le chemin temporaire comme Path object"""
        return Path(self.temp_path).resolve()


# Instance globale avec gestion d'erreurs
try:
    settings = Settings()
except Exception as e:
    if os.getenv("ENVIRONMENT") == "test":
        # Configuration minimale pour les tests
        settings = Settings(
            environment="testing",
            secret_key="test-secret-key",
            supabase_url="http://localhost:54321",
            supabase_anon_key="test-anon-key",
            openai_api_key="test-openai-key"
        )
    else:
        print(f"❌ Erreur de configuration: {e}")
        print("💡 Vérifiez votre fichier .env ou les variables d'environnement")
        print("📝 Consultez .env.example pour un exemple de configuration")
        raise e