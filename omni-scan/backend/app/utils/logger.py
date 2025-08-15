"""
Simple logger module for OmniScan backend
"""
import logging
import sys
from pathlib import Path
from datetime import datetime

# Configuration du logger
LOG_LEVEL = logging.INFO
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_DIR = Path(__file__).parent.parent.parent / "logs"

# Créer le dossier logs s'il n'existe pas
LOG_DIR.mkdir(exist_ok=True)

# Créer le logger principal
logger = logging.getLogger("omniscan")
logger.setLevel(LOG_LEVEL)

# Handler pour la console
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(LOG_LEVEL)
console_formatter = logging.Formatter(LOG_FORMAT)
console_handler.setFormatter(console_formatter)
logger.addHandler(console_handler)

# Handler pour fichier
log_file = LOG_DIR / f"omniscan_{datetime.now().strftime('%Y%m%d')}.log"
file_handler = logging.FileHandler(log_file)
file_handler.setLevel(LOG_LEVEL)
file_formatter = logging.Formatter(LOG_FORMAT)
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Fonction utilitaire pour créer des loggers pour des modules spécifiques
def get_logger(name: str) -> logging.Logger:
    """
    Créer un logger pour un module spécifique
    
    Args:
        name: Nom du module
        
    Returns:
        Logger configuré
    """
    module_logger = logging.getLogger(f"omniscan.{name}")
    return module_logger

# Export
__all__ = ["logger", "get_logger"]