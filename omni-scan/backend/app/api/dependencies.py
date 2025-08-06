"""Dépendances communes pour les API"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_supabase

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Récupérer l'utilisateur courant à partir du token
    """
    supabase = get_supabase()
    
    try:
        # Vérifier le token avec Supabase
        user = supabase.auth.get_user(credentials.credentials)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide ou expiré"
            )
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "is_premium": user.user.user_metadata.get("is_premium", False) if user.user.user_metadata else False
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise"
        )