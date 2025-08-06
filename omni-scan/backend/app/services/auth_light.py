"""
Authentification légère pour OmniScan
Utilise JWT + Redis/Cache pour éviter une BD complète
"""

import jwt
import redis
from datetime import datetime, timedelta
from typing import Optional, Dict
import os
import json

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Client Redis (ou cache mémoire si Redis pas dispo)
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    USE_REDIS = True
except:
    # Fallback : cache mémoire simple
    memory_cache = {}
    USE_REDIS = False


class LightAuth:
    """Gestion des utilisateurs sans base de données"""
    
    @staticmethod
    def create_magic_link(email: str) -> str:
        """Créer un lien magique pour connexion sans mot de passe"""
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(minutes=15),
            "type": "magic_link"
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        
        # URL du lien magique
        return f"https://omniscan.app/auth/verify?token={token}"
    
    @staticmethod
    def verify_magic_link(token: str) -> Optional[str]:
        """Vérifier le lien magique et retourner l'email"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") == "magic_link":
                return payload.get("email")
        except jwt.ExpiredSignatureError:
            return None
        except Exception:
            return None
        return None
    
    @staticmethod
    def create_session(email: str) -> Dict:
        """Créer une session utilisateur"""
        user_id = email  # Email comme ID unique
        
        # Token de session (24h)
        session_token = jwt.encode({
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        # Données utilisateur
        user_data = {
            "email": email,
            "scans_used": 0,
            "scans_limit": 5,  # Limite gratuite
            "is_pro": False,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Stocker dans Redis ou mémoire
        if USE_REDIS:
            redis_client.setex(
                f"user:{user_id}",
                86400,  # 24h
                json.dumps(user_data)
            )
        else:
            memory_cache[f"user:{user_id}"] = user_data
        
        return {
            "token": session_token,
            "user": user_data
        }
    
    @staticmethod
    def get_user(token: str) -> Optional[Dict]:
        """Récupérer les infos utilisateur depuis le token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            
            if USE_REDIS:
                data = redis_client.get(f"user:{user_id}")
                if data:
                    return json.loads(data)
            else:
                return memory_cache.get(f"user:{user_id}")
                
        except Exception:
            return None
        return None
    
    @staticmethod
    def increment_usage(user_id: str) -> bool:
        """Incrémenter le compteur d'usage"""
        if USE_REDIS:
            data = redis_client.get(f"user:{user_id}")
            if data:
                user_data = json.loads(data)
                user_data["scans_used"] += 1
                redis_client.setex(
                    f"user:{user_id}",
                    86400,
                    json.dumps(user_data)
                )
                return True
        else:
            if f"user:{user_id}" in memory_cache:
                memory_cache[f"user:{user_id}"]["scans_used"] += 1
                return True
        return False
    
    @staticmethod
    def check_quota(user_id: str) -> Dict:
        """Vérifier le quota utilisateur"""
        user_data = None
        
        if USE_REDIS:
            data = redis_client.get(f"user:{user_id}")
            if data:
                user_data = json.loads(data)
        else:
            user_data = memory_cache.get(f"user:{user_id}")
        
        if not user_data:
            return {"allowed": True, "reason": "no_user"}
        
        if user_data.get("is_pro"):
            return {"allowed": True, "reason": "pro_user"}
        
        scans_used = user_data.get("scans_used", 0)
        scans_limit = user_data.get("scans_limit", 5)
        
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
    
    @staticmethod
    def upgrade_to_pro(user_id: str, stripe_customer_id: str) -> bool:
        """Passer un utilisateur en Pro après paiement"""
        if USE_REDIS:
            data = redis_client.get(f"user:{user_id}")
            if data:
                user_data = json.loads(data)
                user_data["is_pro"] = True
                user_data["stripe_customer_id"] = stripe_customer_id
                user_data["upgraded_at"] = datetime.utcnow().isoformat()
                redis_client.setex(
                    f"user:{user_id}",
                    86400 * 30,  # 30 jours
                    json.dumps(user_data)
                )
                return True
        else:
            if f"user:{user_id}" in memory_cache:
                memory_cache[f"user:{user_id}"]["is_pro"] = True
                memory_cache[f"user:{user_id}"]["stripe_customer_id"] = stripe_customer_id
                return True
        return False


# Instance globale
auth = LightAuth()