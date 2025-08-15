"""Dépendances communes pour les API"""

from typing import Dict, Any, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_supabase

security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Récupérer l'utilisateur courant à partir du token
    """
    supabase = get_supabase()
    try:
        # Vérifier le token avec Supabase
        user_response = supabase.auth.get_user(credentials.credentials)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide ou expiré"
            )
        user = user_response.user
        user_metadata = user.user_metadata or {}
        return {
            "id": user.id,
            "email": user.email,
            "is_premium": user_metadata.get("is_premium", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise"
        ) from e


async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[Dict[str, Any]]:
    """
    Récupérer l'utilisateur courant à partir du token (optionnel)
    Retourne None si pas de token ou token invalide
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None