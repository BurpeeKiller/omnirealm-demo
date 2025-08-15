"""
Système de retry robuste pour les opérations réseau
Gestion intelligente des échecs temporaires
"""

import asyncio
import random
import time
from dataclasses import dataclass
from functools import wraps
from typing import Callable, Optional, Type

from omni_music.domain.exceptions import DownloadError
from omni_music.infrastructure.logging import get_logger


@dataclass
class RetryConfig:
    """Configuration pour le retry logic"""
    max_attempts: int = 3
    base_delay: float = 1.0  # Délai de base en secondes
    max_delay: float = 60.0   # Délai maximum
    exponential_base: float = 2.0  # Facteur exponentiel
    jitter: bool = True  # Ajouter du jitter pour éviter thundering herd
    retryable_exceptions: tuple = (DownloadError, ConnectionError, TimeoutError)


class RetryableError(Exception):
    """Exception qui peut être retryée"""
    pass


class NonRetryableError(Exception):
    """Exception qui ne doit pas être retryée"""
    pass


def exponential_backoff(attempt: int, config: RetryConfig) -> float:
    """Calcule le délai avec backoff exponentiel"""
    delay = min(
        config.base_delay * (config.exponential_base ** attempt),
        config.max_delay
    )

    if config.jitter:
        # Ajouter 0-50% de jitter
        jitter_amount = delay * 0.5 * random.random()
        delay += jitter_amount

    return delay


def should_retry(exception: Exception, config: RetryConfig) -> bool:
    """Détermine si une exception justifie un retry"""

    # Vérifier les exceptions retryable
    if isinstance(exception, config.retryable_exceptions):
        return True

    # Cas spéciaux yt-dlp
    if isinstance(exception, DownloadError):
        error_msg = str(exception).lower()

        # Erreurs temporaires réseau
        temporary_errors = [
            "timeout", "connection", "network", "temporary",
            "server error", "503", "502", "504", "429"
        ]

        if any(temp_error in error_msg for temp_error in temporary_errors):
            return True

        # Erreurs permanentes (pas de retry)
        permanent_errors = [
            "not found", "unavailable", "private", "deleted",
            "copyright", "blocked", "invalid url"
        ]

        if any(perm_error in error_msg for perm_error in permanent_errors):
            return False

    return False


def retry_async(config: Optional[RetryConfig] = None):
    """Décorateur pour retry automatique sur fonctions async"""
    if config is None:
        config = RetryConfig()

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            logger = get_logger(f"retry.{func.__module__}.{func.__name__}")
            last_exception = None

            for attempt in range(config.max_attempts):
                try:
                    logger.debug(f"Attempt {attempt + 1}/{config.max_attempts}",
                               function=func.__name__,
                               attempt=attempt + 1,
                               max_attempts=config.max_attempts)

                    result = await func(*args, **kwargs)

                    if attempt > 0:
                        logger.info(f"Succeeded after {attempt + 1} attempts",
                                   function=func.__name__,
                                   attempts=attempt + 1)

                    return result

                except Exception as e:
                    last_exception = e

                    # Log de l'échec
                    logger.warning(f"Attempt {attempt + 1} failed",
                                  function=func.__name__,
                                  attempt=attempt + 1,
                                  error=str(e),
                                  error_type=type(e).__name__)

                    # Vérifier si on doit retry
                    if not should_retry(e, config) or attempt == config.max_attempts - 1:
                        logger.error("All retry attempts exhausted",
                                    function=func.__name__,
                                    total_attempts=attempt + 1,
                                    final_error=str(e))
                        raise e

                    # Calculer le délai avant retry
                    delay = exponential_backoff(attempt, config)
                    logger.info(f"Retrying in {delay:.2f}s",
                               function=func.__name__,
                               delay=delay,
                               next_attempt=attempt + 2)

                    await asyncio.sleep(delay)

            # Ne devrait jamais arriver
            if last_exception:
                raise last_exception

        return wrapper
    return decorator


def retry_sync(config: Optional[RetryConfig] = None):
    """Décorateur pour retry automatique sur fonctions synchrones"""
    if config is None:
        config = RetryConfig()

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = get_logger(f"retry.{func.__module__}.{func.__name__}")
            last_exception = None

            for attempt in range(config.max_attempts):
                try:
                    logger.debug(f"Attempt {attempt + 1}/{config.max_attempts}",
                               function=func.__name__,
                               attempt=attempt + 1)

                    result = func(*args, **kwargs)

                    if attempt > 0:
                        logger.info(f"Succeeded after {attempt + 1} attempts",
                                   function=func.__name__,
                                   attempts=attempt + 1)

                    return result

                except Exception as e:
                    last_exception = e

                    logger.warning(f"Attempt {attempt + 1} failed",
                                  function=func.__name__,
                                  error=str(e))

                    if not should_retry(e, config) or attempt == config.max_attempts - 1:
                        logger.error("All retry attempts exhausted",
                                    function=func.__name__,
                                    final_error=str(e))
                        raise e

                    delay = exponential_backoff(attempt, config)
                    logger.info(f"Retrying in {delay:.2f}s", delay=delay)

                    time.sleep(delay)

            if last_exception:
                raise last_exception

        return wrapper
    return decorator


class CircuitBreaker:
    """Circuit breaker pour éviter les appels répétés sur services défaillants"""

    def __init__(self,
                 failure_threshold: int = 5,
                 timeout: float = 60.0,
                 expected_exception: Type[Exception] = Exception):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.expected_exception = expected_exception

        self.failure_count = 0
        self.last_failure_time: Optional[float] = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN

        self.logger = get_logger("circuit_breaker")

    def __call__(self, func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.state == "OPEN":
                if self._should_attempt_reset():
                    self.state = "HALF_OPEN"
                    self.logger.info("Circuit breaker: Attempting reset", state="HALF_OPEN")
                else:
                    self.logger.warning("Circuit breaker: Rejecting call", state="OPEN")
                    raise Exception("Circuit breaker is OPEN")

            try:
                result = await func(*args, **kwargs)
                self._on_success()
                return result

            except self.expected_exception as e:
                self._on_failure()
                raise e

        return wrapper

    def _should_attempt_reset(self) -> bool:
        """Vérifie si on peut tenter de reset le circuit breaker"""
        if self.last_failure_time is None:
            return False
        return time.time() - self.last_failure_time >= self.timeout

    def _on_success(self) -> None:
        """Appelé lors d'un succès"""
        self.failure_count = 0
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
            self.logger.info("Circuit breaker: Reset successful", state="CLOSED")

    def _on_failure(self) -> None:
        """Appelé lors d'un échec"""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            self.logger.warning("Circuit breaker: Opened due to failures",
                              failure_count=self.failure_count,
                              state="OPEN")


# Configurations pré-définies
NETWORK_RETRY_CONFIG = RetryConfig(
    max_attempts=3,
    base_delay=2.0,
    max_delay=30.0,
    exponential_base=2.0,
    retryable_exceptions=(DownloadError, ConnectionError, TimeoutError, OSError)
)

DOWNLOAD_RETRY_CONFIG = RetryConfig(
    max_attempts=5,
    base_delay=1.0,
    max_delay=60.0,
    exponential_base=1.5,
    retryable_exceptions=(DownloadError, ConnectionError, TimeoutError)
)
