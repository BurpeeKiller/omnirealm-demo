"""
Middleware de sécurité pour OmniScan
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
import hashlib

class SecurityMiddleware(BaseHTTPMiddleware):
    """Middleware pour les headers de sécurité"""
    
    async def dispatch(self, request: Request, call_next):
        # Headers de sécurité
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # CSP (Content Security Policy)
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self' https://api.stripe.com https://*.supabase.co; "
            "frame-src https://js.stripe.com https://hooks.stripe.com; "
        )
        response.headers["Content-Security-Policy"] = csp
        
        # HSTS (HTTP Strict Transport Security)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting pour prévenir les abus"""
    
    def __init__(self, app, calls: int = 60, window: int = 60):
        super().__init__(app)
        self.calls = calls  # Nombre d'appels autorisés
        self.window = window  # Fenêtre en secondes
        self.clients = defaultdict(list)
        
    async def dispatch(self, request: Request, call_next):
        # Identifier le client
        client_id = self._get_client_id(request)
        
        # Nettoyer les anciennes entrées
        now = time.time()
        self.clients[client_id] = [
            timestamp for timestamp in self.clients[client_id]
            if timestamp > now - self.window
        ]
        
        # Vérifier la limite
        if len(self.clients[client_id]) >= self.calls:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Too many requests. Please try again later.",
                    "retry_after": self.window
                },
                headers={
                    "Retry-After": str(self.window),
                    "X-RateLimit-Limit": str(self.calls),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(now + self.window))
                }
            )
        
        # Enregistrer l'appel
        self.clients[client_id].append(now)
        
        # Ajouter les headers de rate limit
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(self.calls - len(self.clients[client_id]))
        response.headers["X-RateLimit-Reset"] = str(int(now + self.window))
        
        return response
    
    def _get_client_id(self, request: Request) -> str:
        """Identifier unique du client (IP + User-Agent)"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0]
        else:
            ip = request.client.host if request.client else "unknown"
        
        user_agent = request.headers.get("User-Agent", "")
        
        # Hash pour la privacy
        raw = f"{ip}:{user_agent}"
        return hashlib.sha256(raw.encode()).hexdigest()[:16]


class FileSizeMiddleware(BaseHTTPMiddleware):
    """Vérifier la taille des uploads"""
    
    def __init__(self, app, max_size_mb: int = 50):
        super().__init__(app)
        self.max_size = max_size_mb * 1024 * 1024  # Convertir en bytes
        
    async def dispatch(self, request: Request, call_next):
        # Vérifier Content-Length pour les uploads
        if request.method == "POST" and request.url.path.endswith("/upload"):
            content_length = request.headers.get("Content-Length")
            
            if content_length and int(content_length) > self.max_size:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={
                        "detail": f"File too large. Maximum size is {self.max_size_mb}MB"
                    }
                )
        
        return await call_next(request)