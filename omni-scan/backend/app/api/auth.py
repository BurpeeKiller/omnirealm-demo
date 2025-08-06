"""Authentication endpoints"""

from fastapi import APIRouter, HTTPException, status
from app.core.database import get_supabase
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    TokenResponse,
    MessageResponse,
    UserResponse
)
from app.core.logging import get_logger, APIErrorLogger

router = APIRouter()

# Initialiser le logger et l'assistant d'erreurs
logger = get_logger("api.auth")
error_logger = APIErrorLogger(logger)


@router.post("/auth/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(request: UserLogin):
    """Connexion utilisateur avec validation des données"""
    logger.info(
        "Login attempt",
        extra={"email": request.email}
    )
    
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not response.session:
            error_logger.log_auth_error(
                "/auth/login",
                "Invalid credentials",
                request.email
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiants invalides"
            )
        
        # Construire la réponse avec le schéma
        user_data = None
        if response.user:
            user_data = UserResponse(
                id=response.user.id,
                email=response.user.email,
                created_at=response.user.created_at
            )
        
        logger.info(
            "Login successful",
            extra={
                "user_id": response.user.id if response.user else None,
                "email": request.email
            }
        )
        
        return TokenResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in if hasattr(response.session, 'expires_in') else None,
            user=user_data
        )
    except HTTPException:
        raise
    except Exception as e:
        error_logger.log_external_service_error("supabase_auth", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erreur d'authentification"
        )


@router.post("/auth/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserRegister):
    """Inscription d'un nouvel utilisateur avec validation"""
    logger.info(
        "Registration attempt",
        extra={"email": request.email}
    )
    
    try:
        supabase = get_supabase()
        
        # La validation du mot de passe est déjà faite par Pydantic
        # via le validator dans UserRegister
        
        # Créer l'utilisateur
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        if response.user:
            # Créer le profil utilisateur
            try:
                supabase.table("user_profiles").insert({
                    "id": response.user.id,
                    "email": request.email,
                    "documents_used": 0,
                    "documents_quota": 5,
                    "subscription_tier": "free"
                }).execute()
                
                logger.info(
                    "User profile created",
                    extra={
                        "user_id": response.user.id,
                        "email": request.email
                    }
                )
            except Exception as e:
                logger.warning(
                    "Failed to create user profile",
                    extra={
                        "user_id": response.user.id,
                        "error": str(e)
                    }
                )
                # Ne pas bloquer l'inscription
            
            logger.info(
                "Registration successful",
                extra={
                    "user_id": response.user.id,
                    "email": request.email
                }
            )
            
            return MessageResponse(
                message="Inscription réussie",
                details=f"Utilisateur {request.email} créé avec succès"
            )
        else:
            error_logger.log_auth_error(
                "/auth/register",
                "No user returned from signup",
                request.email
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Erreur lors de l'inscription"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        # Vérifier si c'est une erreur d'email déjà utilisé
        error_msg = str(e).lower()
        if "already registered" in error_msg or "duplicate" in error_msg:
            error_logger.log_auth_error(
                "/auth/register",
                "Email already exists",
                request.email
            )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cette adresse email est déjà utilisée"
            )
        
        error_logger.log_external_service_error("supabase_auth", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erreur lors de l'inscription"
        )


@router.post("/auth/logout", response_model=MessageResponse)
async def logout():
    """Déconnexion utilisateur"""
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        
        logger.info("User logged out successfully")
        
        return MessageResponse(
            message="Déconnexion réussie",
            details="Session terminée avec succès"
        )
    except Exception as e:
        logger.error(
            "Logout error",
            extra={"error": str(e)}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erreur lors de la déconnexion"
        )