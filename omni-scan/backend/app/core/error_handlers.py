"""Gestionnaires d'erreurs centralisés pour OmniScan"""

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import OmniScanException
from app.core.logging import get_logger
import traceback

logger = get_logger("error_handlers")


async def omniscan_exception_handler(request: Request, exc: OmniScanException):
    """Gestionnaire pour les exceptions OmniScan"""
    logger.error(
        f"OmniScanException: {exc.message}",
        extra={
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "details": exc.details,
            "path": request.url.path
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "code": exc.error_code,
                "details": exc.details
            }
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Gestionnaire pour les exceptions HTTP standard"""
    logger.warning(
        f"HTTPException: {exc.detail}",
        extra={
            "status_code": exc.status_code,
            "path": request.url.path
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": str(exc.detail),
                "code": f"HTTP_{exc.status_code}"
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Gestionnaire pour toutes les autres exceptions"""
    logger.error(
        f"Unhandled exception: {str(exc)}",
        extra={
            "exception_type": type(exc).__name__,
            "path": request.url.path,
            "traceback": traceback.format_exc()
        },
        exc_info=True
    )
    
    # En production, ne pas exposer les détails
    message = "Une erreur interne s'est produite"
    if hasattr(exc, '__class__'):
        error_code = f"INTERNAL_{exc.__class__.__name__.upper()}"
    else:
        error_code = "INTERNAL_SERVER_ERROR"
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": message,
                "code": error_code
            }
        }
    )


def register_error_handlers(app):
    """Enregistrer tous les gestionnaires d'erreurs sur l'application"""
    app.add_exception_handler(OmniScanException, omniscan_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)