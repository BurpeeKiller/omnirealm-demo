"""Configuration du logging structuré pour l'application"""

import logging
import sys
from pythonjsonlogger import jsonlogger
from app.core.config import settings


def setup_logging(log_level: str = "INFO") -> None:
    """
    Configurer le logging structuré pour l'application.
    
    Args:
        log_level: Niveau de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    # Formateur JSON pour les logs structurés
    json_formatter = jsonlogger.JsonFormatter(
        "%(timestamp)s %(level)s %(name)s %(message)s",
        rename_fields={
            "timestamp": "@timestamp",
            "level": "level",
            "name": "logger"
        }
    )
    
    # Handler pour stdout
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(json_formatter)
    
    # Configuration du logger racine
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers = [stdout_handler]
    
    # Logs spécifiques pour l'application
    app_logger = logging.getLogger("omniscan")
    app_logger.setLevel(log_level)
    
    # Réduire le niveau de log pour certaines librairies bruyantes
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("watchfiles").setLevel(logging.WARNING)
    
    # Logger pour les requêtes HTTP (si debug activé)
    if settings.debug:
        logging.getLogger("httpx").setLevel(logging.DEBUG)
        logging.getLogger("httpcore").setLevel(logging.DEBUG)
    else:
        logging.getLogger("httpx").setLevel(logging.WARNING)
        logging.getLogger("httpcore").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Obtenir un logger pour un module spécifique.
    
    Args:
        name: Nom du module (ex: "omniscan.api.upload")
        
    Returns:
        Logger configuré
    """
    return logging.getLogger(f"omniscan.{name}")


# Logger pour les erreurs API
class APIErrorLogger:
    """Helper pour logger les erreurs API de manière cohérente"""
    
    def __init__(self, logger: logging.Logger):
        self.logger = logger
    
    def log_validation_error(self, endpoint: str, error: dict, user_id: str = None):
        """Logger une erreur de validation"""
        self.logger.warning(
            "Validation error",
            extra={
                "endpoint": endpoint,
                "error_type": "validation",
                "error_details": error,
                "user_id": user_id
            }
        )
    
    def log_auth_error(self, endpoint: str, reason: str, email: str = None):
        """Logger une erreur d'authentification"""
        self.logger.warning(
            "Authentication error",
            extra={
                "endpoint": endpoint,
                "error_type": "authentication",
                "reason": reason,
                "email": email
            }
        )
    
    def log_quota_exceeded(self, user_id: str, documents_used: int, quota: int):
        """Logger un dépassement de quota"""
        self.logger.info(
            "Quota exceeded",
            extra={
                "error_type": "quota",
                "user_id": user_id,
                "documents_used": documents_used,
                "quota": quota
            }
        )
    
    def log_processing_error(self, document_id: str, error: str, stage: str):
        """Logger une erreur de traitement"""
        self.logger.error(
            "Document processing error",
            extra={
                "error_type": "processing",
                "document_id": document_id,
                "stage": stage,
                "error": str(error)
            }
        )
    
    def log_external_service_error(self, service: str, error: str, document_id: str = None):
        """Logger une erreur de service externe"""
        self.logger.error(
            f"External service error: {service}",
            extra={
                "error_type": "external_service",
                "service": service,
                "error": str(error),
                "document_id": document_id
            }
        )