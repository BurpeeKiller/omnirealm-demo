"""
Infrastructure de logging pour OmniMusic Pro
Observabilité et monitoring des opérations
"""

import json
import logging
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from functools import wraps
from pathlib import Path
from typing import Any, Callable, Dict, Optional


@dataclass
class OperationMetrics:
    """Métriques pour une opération"""
    operation: str
    start_time: float
    end_time: Optional[float] = None
    success: bool = False
    error: Optional[str] = None
    metadata: Dict[str, Any] = None

    @property
    def duration(self) -> Optional[float]:
        """Durée de l'opération en secondes"""
        if self.end_time and self.start_time:
            return self.end_time - self.start_time
        return None


class StructuredLogger:
    """Logger structuré pour OmniMusic"""

    def __init__(self, name: str, log_dir: Optional[Path] = None):
        self.logger = logging.getLogger(name)
        self.log_dir = log_dir or Path.cwd() / "logs"
        self.setup_logging()

    def setup_logging(self) -> None:
        """Configuration du logging"""
        self.logger.setLevel(logging.INFO)

        # Éviter les doublons
        if self.logger.handlers:
            return

        # Handler console avec couleurs
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)

        # Handler fichier pour persistence
        if self.log_dir:
            self.log_dir.mkdir(exist_ok=True)
            file_handler = logging.FileHandler(
                self.log_dir / f"omni-music-{datetime.now().strftime('%Y%m%d')}.log"
            )
            file_handler.setLevel(logging.DEBUG)

            # Format JSON pour parsing facile
            json_formatter = logging.Formatter(
                '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
                '"module": "%(name)s", "message": %(message)s}'
            )
            file_handler.setFormatter(json_formatter)
            self.logger.addHandler(file_handler)

        # Format lisible pour console
        console_formatter = logging.Formatter(
            '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s'
        )
        console_handler.setFormatter(console_formatter)
        self.logger.addHandler(console_handler)

    def info(self, message: str, **kwargs) -> None:
        """Log niveau INFO avec métadonnées"""
        self._log_with_metadata(logging.INFO, message, kwargs)

    def debug(self, message: str, **kwargs) -> None:
        """Log niveau DEBUG avec métadonnées"""
        self._log_with_metadata(logging.DEBUG, message, kwargs)

    def warning(self, message: str, **kwargs) -> None:
        """Log niveau WARNING avec métadonnées"""
        self._log_with_metadata(logging.WARNING, message, kwargs)

    def error(self, message: str, error: Optional[Exception] = None, **kwargs) -> None:
        """Log niveau ERROR avec exception et métadonnées"""
        if error:
            kwargs['error_type'] = type(error).__name__
            kwargs['error_message'] = str(error)
        self._log_with_metadata(logging.ERROR, message, kwargs)

    def _log_with_metadata(self, level: int, message: str, metadata: Dict[str, Any]) -> None:
        """Log avec métadonnées structurées"""
        if metadata:
            # Serialization sécurisée
            safe_metadata = {}
            for key, value in metadata.items():
                try:
                    json.dumps(value)  # Test si serializable
                    safe_metadata[key] = value
                except (TypeError, ValueError):
                    safe_metadata[key] = str(value)

            structured_message = json.dumps({
                "message": message,
                "metadata": safe_metadata
            })
            self.logger.log(level, structured_message)
        else:
            self.logger.log(level, json.dumps({"message": message}))


def performance_monitor(operation_name: str):
    """Décorateur pour monitoring des performances"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            logger = StructuredLogger(f"perf.{func.__module__}.{func.__name__}")

            metrics = OperationMetrics(
                operation=operation_name,
                start_time=time.time()
            )

            try:
                logger.info(f"Starting {operation_name}",
                           operation=operation_name,
                           function=func.__name__)

                result = await func(*args, **kwargs)

                metrics.end_time = time.time()
                metrics.success = True

                logger.info(f"Completed {operation_name}",
                           operation=operation_name,
                           duration=metrics.duration,
                           success=True)

                return result

            except Exception as e:
                metrics.end_time = time.time()
                metrics.success = False
                metrics.error = str(e)

                logger.error(f"Failed {operation_name}",
                            error=e,
                            operation=operation_name,
                            duration=metrics.duration,
                            success=False)

                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            logger = StructuredLogger(f"perf.{func.__module__}.{func.__name__}")

            metrics = OperationMetrics(
                operation=operation_name,
                start_time=time.time()
            )

            try:
                logger.info(f"Starting {operation_name}",
                           operation=operation_name,
                           function=func.__name__)

                result = func(*args, **kwargs)

                metrics.end_time = time.time()
                metrics.success = True

                logger.info(f"Completed {operation_name}",
                           operation=operation_name,
                           duration=metrics.duration,
                           success=True)

                return result

            except Exception as e:
                metrics.end_time = time.time()
                metrics.success = False
                metrics.error = str(e)

                logger.error(f"Failed {operation_name}",
                            error=e,
                            operation=operation_name,
                            duration=metrics.duration,
                            success=False)

                raise

        # Retourner le bon wrapper selon si la fonction est async
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# Instance globale
logger = StructuredLogger("omni_music")


def get_logger(name: str) -> StructuredLogger:
    """Factory pour obtenir un logger nommé"""
    return StructuredLogger(name)
