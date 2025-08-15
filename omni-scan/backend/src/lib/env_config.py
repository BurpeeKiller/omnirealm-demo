"""
Configuration centralisée pour OmniScan Backend
Remplace progressivement config.py avec validation Zod-like
"""

from typing import List, Union, Any, Dict
from pydantic import Field, field_validator, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvConfig(BaseSettings):
    """Configuration avec validation stricte des variables d'environnement"""
    
    # Environment
    environment: str = Field(default="development", pattern="^(development|testing|production)$")
    debug: bool = Field(default=True)
    project_name: str = Field(default="OmniScan", description="Project display name")
    project_version: str = Field(default="2.0.0", description="Project version")
    api_prefix: str = Field(default="/api/v1", description="API path prefix")
    
    # Security
    secret_key: SecretStr = Field(..., min_length=32, description="Secret key for JWT tokens")
    
    # URLs
    backend_url: str = Field(default="http://localhost:8000", pattern="^https?://")
    cors_origins: Union[List[str], str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins"
    )
    
    # Supabase
    supabase_url: str = Field(..., pattern="^https?://", description="Supabase project URL")
    supabase_anon_key: str = Field(..., min_length=1, description="Supabase anonymous key")
    supabase_service_key: SecretStr = Field(..., min_length=1, description="Supabase service role key")
    
    # OpenAI
    openai_api_key: SecretStr = Field(..., min_length=1, description="OpenAI API key")
    openai_model: str = Field(default="gpt-4o-mini", description="OpenAI model to use")
    
    # File handling
    max_file_size_mb: int = Field(default=50, ge=1, le=500, description="Max file size in MB")
    upload_path: str = Field(default="uploads", description="Path for file uploads")
    temp_path: str = Field(default="temp", description="Path for temporary files")
    ocr_languages: str = Field(default="fra+eng", description="OCR languages")
    allowed_extensions: List[str] = Field(
        default=["pdf", "png", "jpg", "jpeg", "tiff", "bmp"],
        description="Allowed file extensions for upload"
    )
    
    # Rate limiting
    rate_limit_per_minute: int = Field(default=60, ge=1, le=1000, description="API rate limit per minute")
    
    # Logging
    log_level: str = Field(default="INFO", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$")
    log_format: str = Field(default="json", pattern="^(json|simple)$")
    
    @field_validator("cors_origins", mode="before")
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @field_validator("backend_url", "supabase_url")
    def validate_url(cls, v):
        """Ensure URLs don't have trailing slashes"""
        return v.rstrip("/")
    
    @property
    def is_development(self) -> bool:
        return self.environment == "development"
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    @property
    def is_testing(self) -> bool:
        return self.environment == "testing"
    
    @property
    def max_file_size_bytes(self) -> int:
        """Get max file size in bytes"""
        return self.max_file_size_mb * 1024 * 1024
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        # Désactive le parsing JSON automatique pour certains champs
        json_schema_serialization_defaults_required=True,
    )


# Instance globale de configuration
try:
    env_config = EnvConfig()
except Exception as e:
    print(f"❌ Configuration error: {e}")
    print("Please check your .env file and ensure all required variables are set.")
    raise


# Export des configurations publiques (sans secrets)
public_config = {
    "environment": env_config.environment,
    "backend_url": env_config.backend_url,
    "max_file_size_mb": env_config.max_file_size_mb,
    "ocr_languages": env_config.ocr_languages,
    "allowed_origins": env_config.cors_origins,
}

# Export des configurations serveur (avec secrets - usage interne uniquement)
server_config = {
    "secret_key": env_config.secret_key.get_secret_value(),
    "supabase_url": env_config.supabase_url,
    "supabase_anon_key": env_config.supabase_anon_key,
    "supabase_service_key": env_config.supabase_service_key.get_secret_value(),
    "openai_api_key": env_config.openai_api_key.get_secret_value(),
    "openai_model": env_config.openai_model,
}