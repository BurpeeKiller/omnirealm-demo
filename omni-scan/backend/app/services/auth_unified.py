"""
Service d'authentification unifié
Combine les fonctionnalités de auth.py et auth_light.py
"""

import jwt
import redis
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
import json
from enum import Enum

from app.core.config import settings
from app.core.database import get_supabase
from app.core.logging import get_logger

logger = get_logger("auth_unified")


class AuthMode(Enum):
    """Modes d'authentification disponibles"""
    SUPABASE = "supabase"  # Authentification complète avec Supabase
    LIGHT = "light"        # Authentification légère avec JWT + Redis/Mémoire
    DEMO = "demo"          # Mode démo sans persistance


class AuthConfig:
    """Configuration pour le service d'authentification"""
    def __init__(
        self,
        mode: AuthMode = AuthMode.SUPABASE,
        jwt_secret: Optional[str] = None,
        redis_url: Optional[str] = None,
        session_duration: int = 24,  # heures
        magic_link_duration: int = 15,  # minutes
        free_scan_limit: int = 5
    ):
        self.mode = mode
        self.jwt_secret = jwt_secret or settings.jwt_secret_key or "default-secret-change-in-production"
        self.redis_url = redis_url or os.getenv("REDIS_URL", "redis://localhost:6379")
        self.session_duration = session_duration
        self.magic_link_duration = magic_link_duration
        self.free_scan_limit = free_scan_limit


class UnifiedAuthService:
    """Service d'authentification unifié"""
    
    def __init__(self, config: Optional[AuthConfig] = None):
        self.config = config or AuthConfig()
        self._init_storage()
    
    def _init_storage(self):
        """Initialiser le stockage selon le mode"""
        if self.config.mode == AuthMode.LIGHT:
            try:
                self.redis_client = redis.from_url(self.config.redis_url, decode_responses=True)
                self.redis_client.ping()
                self.use_redis = True
                logger.info("Using Redis for light auth storage")
            except Exception as e:
                logger.warning(f"Redis unavailable, using memory storage: {e}")
                self.memory_cache = {}
                self.use_redis = False
        else:
            self.use_redis = False
            self.memory_cache = None
    
    # ===== Méthodes communes =====
    
    async def create_magic_link(self, email: str) -> str:
        """Créer un lien magique pour connexion sans mot de passe"""
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(minutes=self.config.magic_link_duration),
            "type": "magic_link"
        }
        token = jwt.encode(payload, self.config.jwt_secret, algorithm="HS256")
        
        # URL du lien magique
        base_url = os.getenv("FRONTEND_URL", "https://omniscan.app")
        return f"{base_url}/auth/verify?token={token}"
    
    async def verify_magic_link(self, token: str) -> Optional[str]:
        """Vérifier le lien magique et retourner l'email"""
        try:
            payload = jwt.decode(token, self.config.jwt_secret, algorithms=["HS256"])
            if payload.get("type") == "magic_link":
                return payload.get("email")
        except jwt.ExpiredSignatureError:
            logger.warning("Magic link expired")
            return None
        except Exception as e:
            logger.error(f"Error verifying magic link: {e}")
            return None
        return None
    
    # ===== Méthodes selon le mode =====
    
    async def login(self, email: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Connexion utilisateur selon le mode"""
        if self.config.mode == AuthMode.SUPABASE:
            return await self._login_supabase(email, password)
        elif self.config.mode == AuthMode.LIGHT:
            return await self._login_light(email)
        else:  # DEMO
            return await self._login_demo(email)
    
    async def register(self, email: str, password: Optional[str] = None, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Inscription utilisateur selon le mode"""
        if self.config.mode == AuthMode.SUPABASE:
            return await self._register_supabase(email, password, metadata)
        elif self.config.mode == AuthMode.LIGHT:
            return await self._register_light(email, metadata)
        else:  # DEMO
            return await self._register_demo(email)
    
    async def get_user(self, token: str) -> Optional[Dict[str, Any]]:
        """Récupérer les infos utilisateur depuis le token"""
        if self.config.mode == AuthMode.SUPABASE:
            return await self._get_user_supabase(token)
        elif self.config.mode == AuthMode.LIGHT:
            return await self._get_user_light(token)
        else:  # DEMO
            return await self._get_user_demo(token)
    
    async def check_quota(self, user_id: str) -> Dict[str, Any]:
        """Vérifier le quota utilisateur"""
        if self.config.mode == AuthMode.SUPABASE:
            return await self._check_quota_supabase(user_id)
        elif self.config.mode == AuthMode.LIGHT:
            return await self._check_quota_light(user_id)
        else:  # DEMO
            return {"allowed": True, "reason": "demo_mode"}
    
    async def increment_usage(self, user_id: str) -> bool:
        """Incrémenter le compteur d'usage"""
        if self.config.mode == AuthMode.SUPABASE:
            return await self._increment_usage_supabase(user_id)
        elif self.config.mode == AuthMode.LIGHT:
            return await self._increment_usage_light(user_id)
        else:  # DEMO
            return True
    
    # ===== Implémentations Supabase =====
    
    async def _login_supabase(self, email: str, password: str) -> Dict[str, Any]:
        """Connexion avec Supabase"""
        if not password:
            raise ValueError("Password required for Supabase auth")
        
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not response.session:
            raise ValueError("Invalid credentials")
        
        return {
            "token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "metadata": response.user.user_metadata
            }
        }
    
    async def _register_supabase(self, email: str, password: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Inscription avec Supabase"""
        if not password:
            raise ValueError("Password required for Supabase auth")
        
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": metadata} if metadata else {}
        })
        
        if not response.user:
            raise ValueError("Registration failed")
        
        return {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "metadata": response.user.user_metadata
            },
            "confirmation_required": True
        }
    
    async def _get_user_supabase(self, token: str) -> Optional[Dict[str, Any]]:
        """Récupérer utilisateur Supabase"""
        supabase = get_supabase()
        try:
            response = supabase.auth.get_user(token)
            if response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email,
                    "metadata": response.user.user_metadata
                }
        except Exception as e:
            logger.error(f"Error getting Supabase user: {e}")
        return None
    
    async def _check_quota_supabase(self, user_id: str) -> Dict[str, Any]:
        """Vérifier quota avec Supabase"""
        supabase = get_supabase()
        
        # Récupérer les stats utilisateur depuis la table user_stats
        response = supabase.table("user_stats").select("*").eq("user_id", user_id).single().execute()
        
        if response.data:
            stats = response.data
            is_pro = stats.get("subscription_status") == "pro"
            scans_used = stats.get("total_scans", 0)
            
            if is_pro:
                return {"allowed": True, "reason": "pro_user"}
            
            if scans_used >= self.config.free_scan_limit:
                return {
                    "allowed": False,
                    "reason": "quota_exceeded",
                    "used": scans_used,
                    "limit": self.config.free_scan_limit
                }
        
        return {
            "allowed": True,
            "reason": "within_quota",
            "used": 0,
            "limit": self.config.free_scan_limit,
            "remaining": self.config.free_scan_limit
        }
    
    async def _increment_usage_supabase(self, user_id: str) -> bool:
        """Incrémenter usage avec Supabase"""
        supabase = get_supabase()
        
        try:
            # Incrémenter le compteur dans user_stats
            supabase.rpc("increment_user_scans", {"p_user_id": user_id}).execute()
            return True
        except Exception as e:
            logger.error(f"Error incrementing usage: {e}")
            return False
    
    # ===== Implémentations Light =====
    
    async def _login_light(self, email: str) -> Dict[str, Any]:
        """Connexion légère (sans mot de passe)"""
        # Créer directement une session
        return await self._create_session_light(email)
    
    async def _register_light(self, email: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Inscription légère"""
        # En mode light, l'inscription est implicite
        return await self._create_session_light(email, metadata)
    
    async def _create_session_light(self, email: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Créer une session légère"""
        user_id = email  # Email comme ID unique
        
        # Token de session
        session_token = jwt.encode({
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=self.config.session_duration)
        }, self.config.jwt_secret, algorithm="HS256")
        
        # Données utilisateur
        user_data = {
            "email": email,
            "scans_used": 0,
            "scans_limit": self.config.free_scan_limit,
            "is_pro": False,
            "created_at": datetime.utcnow().isoformat(),
            **(metadata or {})
        }
        
        # Stocker
        if self.use_redis:
            self.redis_client.setex(
                f"user:{user_id}",
                self.config.session_duration * 3600,
                json.dumps(user_data)
            )
        else:
            self.memory_cache[f"user:{user_id}"] = user_data
        
        return {
            "token": session_token,
            "user": user_data
        }
    
    async def _get_user_light(self, token: str) -> Optional[Dict[str, Any]]:
        """Récupérer utilisateur léger"""
        try:
            payload = jwt.decode(token, self.config.jwt_secret, algorithms=["HS256"])
            user_id = payload.get("user_id")
            
            if self.use_redis:
                data = self.redis_client.get(f"user:{user_id}")
                if data:
                    return json.loads(data)
            else:
                return self.memory_cache.get(f"user:{user_id}")
        except Exception as e:
            logger.error(f"Error getting light user: {e}")
        return None
    
    async def _check_quota_light(self, user_id: str) -> Dict[str, Any]:
        """Vérifier quota léger"""
        user_data = None
        
        if self.use_redis:
            data = self.redis_client.get(f"user:{user_id}")
            if data:
                user_data = json.loads(data)
        else:
            user_data = self.memory_cache.get(f"user:{user_id}")
        
        if not user_data:
            return {"allowed": True, "reason": "no_user"}
        
        if user_data.get("is_pro"):
            return {"allowed": True, "reason": "pro_user"}
        
        scans_used = user_data.get("scans_used", 0)
        scans_limit = user_data.get("scans_limit", self.config.free_scan_limit)
        
        if scans_used >= scans_limit:
            return {
                "allowed": False,
                "reason": "quota_exceeded",
                "used": scans_used,
                "limit": scans_limit
            }
        
        return {
            "allowed": True,
            "reason": "within_quota",
            "used": scans_used,
            "limit": scans_limit,
            "remaining": scans_limit - scans_used
        }
    
    async def _increment_usage_light(self, user_id: str) -> bool:
        """Incrémenter usage léger"""
        if self.use_redis:
            data = self.redis_client.get(f"user:{user_id}")
            if data:
                user_data = json.loads(data)
                user_data["scans_used"] = user_data.get("scans_used", 0) + 1
                self.redis_client.setex(
                    f"user:{user_id}",
                    self.config.session_duration * 3600,
                    json.dumps(user_data)
                )
                return True
        else:
            if f"user:{user_id}" in self.memory_cache:
                self.memory_cache[f"user:{user_id}"]["scans_used"] += 1
                return True
        return False
    
    # ===== Implémentations Demo =====
    
    async def _login_demo(self, email: str) -> Dict[str, Any]:
        """Connexion démo"""
        return {
            "token": "demo-token-" + email,
            "user": {
                "email": email,
                "demo": True,
                "scans_limit": "unlimited"
            }
        }
    
    async def _register_demo(self, email: str) -> Dict[str, Any]:
        """Inscription démo"""
        return await self._login_demo(email)
    
    async def _get_user_demo(self, token: str) -> Optional[Dict[str, Any]]:
        """Récupérer utilisateur démo"""
        if token.startswith("demo-token-"):
            email = token.replace("demo-token-", "")
            return {
                "email": email,
                "demo": True,
                "scans_limit": "unlimited"
            }
        return None


# Instance globale par défaut
default_auth_service = UnifiedAuthService()


def get_auth_service(mode: Optional[AuthMode] = None) -> UnifiedAuthService:
    """Obtenir une instance du service d'authentification"""
    if mode:
        config = AuthConfig(mode=mode)
        return UnifiedAuthService(config)
    return default_auth_service