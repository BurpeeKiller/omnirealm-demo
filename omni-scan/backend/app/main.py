"""OmniScan Backend - Point d'entrée FastAPI"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import time

from app.core.config import settings
from app.api import health, auth, upload_unified, stats, auth_light, payment, test_ai, export, batch_simple as batch, ocr_v2
# Import temporaire des anciennes routes pour compatibilité
from app.core.database import init_db
from app.core.logging import setup_logging, get_logger
from app.core.error_handlers import register_error_handlers
from app.core.api_key_manager import get_api_key_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    # Configurer le logging
    setup_logging("DEBUG" if settings.debug else "INFO")
    logger = get_logger("main")
    
    # Startup
    logger.info(
        f"Starting {settings.app_name}",
        extra={
            "version": settings.app_version,
            "environment": settings.environment
        }
    )
    
    # Créer les dossiers nécessaires
    os.makedirs(settings.upload_path, exist_ok=True)
    os.makedirs(settings.temp_path, exist_ok=True)
    logger.debug(f"Created directories: {settings.upload_path}, {settings.temp_path}")
    
    # Initialiser la base de données
    await init_db()
    
    # Initialiser les clés API par défaut de manière sécurisée
    api_key_manager = get_api_key_manager()
    
    # Charger les clés depuis les variables d'environnement
    if settings.openai_api_key:
        api_key_manager.set_default_key("openai", settings.openai_api_key)
    
    # Ajouter d'autres providers si configurés
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        api_key_manager.set_default_key("anthropic", anthropic_key)
    
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        api_key_manager.set_default_key("groq", groq_key)
    
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        api_key_manager.set_default_key("openrouter", openrouter_key)
    
    logger.info("API key manager initialized with default keys")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")


# Créer l'application FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Inclure les routes
app.include_router(health.router, prefix=settings.api_prefix, tags=["health"])
app.include_router(auth.router, prefix=settings.api_prefix, tags=["auth"])

# Routes unifiées (nouvelles)
app.include_router(upload_unified.router, prefix=settings.api_prefix, tags=["upload"])

# Routes legacy (temporaires pour compatibilité)
# TODO: Supprimer après validation complète
# app.include_router(upload.router, prefix=settings.api_prefix, tags=["upload-legacy"])
# app.include_router(upload_simple.router, prefix=settings.api_prefix, tags=["simple-legacy"])

app.include_router(stats.router, prefix=settings.api_prefix, tags=["stats"])
app.include_router(auth_light.router, prefix=settings.api_prefix, tags=["auth-light"])
app.include_router(payment.router, prefix=settings.api_prefix, tags=["payment"])
app.include_router(test_ai.router, prefix=settings.api_prefix, tags=["test"])
app.include_router(export.router, prefix=settings.api_prefix, tags=["export"])
app.include_router(batch.router, prefix=settings.api_prefix, tags=["batch"])
app.include_router(ocr_v2.router, prefix=settings.api_prefix, tags=["ocr-v2"])


@app.middleware("http")
async def custom_cors_middleware(request: Request, call_next):
    """Middleware personnalisé pour gérer CORS et debug"""
    # Log pour debug
    if request.method == "OPTIONS":
        logger = get_logger("cors")
        logger.info(f"OPTIONS request from {request.headers.get('origin')} to {request.url}")
    
    # Pour les requêtes OPTIONS, retourner directement la réponse
    if request.method == "OPTIONS":
        return JSONResponse(
            content={},
            headers={
                "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true",
            }
        )
    
    # Pour les autres requêtes, continuer normalement
    response = await call_next(request)
    
    # Ajouter les headers CORS à toutes les réponses
    origin = request.headers.get("origin")
    if origin in settings.cors_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware pour logger toutes les requêtes"""
    logger = get_logger("middleware")
    start_time = time.time()
    
    # Logger la requête entrante
    logger.info(
        "Request started",
        extra={
            "method": request.method,
            "url": str(request.url),
            "client": request.client.host if request.client else None
        }
    )
    
    # Traiter la requête
    response = await call_next(request)
    
    # Calculer le temps de traitement
    process_time = time.time() - start_time
    
    # Logger la réponse
    logger.info(
        "Request completed",
        extra={
            "method": request.method,
            "url": str(request.url),
            "status_code": response.status_code,
            "process_time": round(process_time, 3)
        }
    )
    
    # Ajouter le temps de traitement aux headers
    response.headers["X-Process-Time"] = str(process_time)
    
    return response


# Enregistrer les gestionnaires d'erreurs centralisés
register_error_handlers(app)


@app.get("/")
async def root():
    """Route racine"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs"
    }