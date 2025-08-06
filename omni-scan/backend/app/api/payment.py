"""
Gestion des paiements avec Stripe/LemonSqueezy
"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional
import os
import stripe
from app.services.auth_light import auth
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger("payment")

# Configuration Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_omniscan_pro_monthly")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3004")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY


@router.post("/create-checkout")
async def create_checkout_session(
    authorization: Optional[str] = Header(None)
):
    """Créer une session de paiement Stripe"""
    
    if not STRIPE_SECRET_KEY:
        # Mode demo sans Stripe
        return {
            "url": f"{FRONTEND_URL}/upgrade?demo=true",
            "message": "Mode demo - Stripe non configuré"
        }
    
    # Extraire le token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requis")
    
    token = authorization.split(" ")[1]
    user = auth.get_user(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    
    try:
        # Créer la session Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/pricing",
            customer_email=user.get("email"),
            metadata={
                "user_id": user.get("email")
            }
        )
        
        return {"url": session.url}
        
    except Exception as e:
        logger.error(f"Erreur Stripe: {e}")
        raise HTTPException(status_code=500, detail="Erreur création paiement")


@router.post("/webhook")
async def stripe_webhook(request: dict):
    """Webhook Stripe pour confirmer les paiements"""
    
    # Vérifier la signature webhook (en production)
    # ...
    
    event_type = request.get("type")
    
    if event_type == "checkout.session.completed":
        session = request.get("data", {}).get("object", {})
        user_id = session.get("metadata", {}).get("user_id")
        customer_id = session.get("customer")
        
        if user_id:
            # Passer l'utilisateur en Pro
            auth.upgrade_to_pro(user_id, customer_id)
            logger.info(f"Utilisateur {user_id} passé en Pro")
    
    return {"received": True}


@router.get("/check-subscription")
async def check_subscription(
    authorization: Optional[str] = Header(None)
):
    """Vérifier le statut d'abonnement"""
    
    if not authorization or not authorization.startswith("Bearer "):
        return {"is_pro": False, "reason": "no_token"}
    
    token = authorization.split(" ")[1]
    user = auth.get_user(token)
    
    if not user:
        return {"is_pro": False, "reason": "no_user"}
    
    quota = auth.check_quota(user.get("email"))
    
    return {
        "is_pro": user.get("is_pro", False),
        "scans_used": quota.get("used", 0),
        "scans_limit": quota.get("limit", 5),
        "scans_remaining": quota.get("remaining", 5)
    }