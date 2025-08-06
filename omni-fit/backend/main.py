from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import stripe
import os
from dotenv import load_dotenv
import logging

# Configuration
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# FastAPI app
app = FastAPI(title="OmniFit API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3003")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class CreateCheckoutSession(BaseModel):
    price_id: str
    user_email: Optional[str] = None

class CreatePortalSession(BaseModel):
    customer_id: str

# Routes
@app.get("/")
async def root():
    return {"message": "OmniFit API", "status": "running"}

@app.post("/api/create-checkout-session")
async def create_checkout_session(data: CreateCheckoutSession):
    """Crée une session de checkout Stripe"""
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": data.price_id,
                "quantity": 1,
            }],
            mode="subscription",
            success_url=os.getenv("SUCCESS_URL") + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=os.getenv("CANCEL_URL"),
            subscription_data={
                "trial_period_days": 7,  # 7 jours d'essai gratuit
            },
            customer_email=data.user_email,
            metadata={
                "app": "omnifit",
                "version": "1.0.0"
            }
        )
        return {"url": session.url, "session_id": session.id}
    except Exception as e:
        logger.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/create-portal-session")
async def create_portal_session(data: CreatePortalSession):
    """Crée une session du portail client Stripe"""
    try:
        session = stripe.billing_portal.Session.create(
            customer=data.customer_id,
            return_url=os.getenv("FRONTEND_URL", "http://localhost:3003"),
        )
        return {"url": session.url}
    except Exception as e:
        logger.error(f"Stripe portal error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """Webhook Stripe pour gérer les événements"""
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Gérer les événements
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        logger.info(f"✅ Nouveau client : {session.get('customer_email', 'Unknown')}")
        # TODO: Créer l'utilisateur dans la DB
        
    elif event["type"] == "customer.subscription.created":
        subscription = event["data"]["object"]
        logger.info(f"📅 Nouvel abonnement : {subscription['id']}")
        # TODO: Mettre à jour le statut premium de l'utilisateur
        
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        logger.info(f"❌ Abonnement annulé : {subscription['id']}")
        # TODO: Retirer le statut premium
        
    elif event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        logger.info(f"💰 Paiement reçu : {invoice['amount_paid'] / 100}€")

    return {"received": True}

@app.get("/api/subscription/{customer_id}")
async def get_subscription(customer_id: str):
    """Récupère le statut d'abonnement d'un client"""
    try:
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status="active",
            limit=1
        )
        
        if subscriptions.data:
            sub = subscriptions.data[0]
            return {
                "active": True,
                "plan": sub.items.data[0].price.id,
                "current_period_end": sub.current_period_end,
                "cancel_at_period_end": sub.cancel_at_period_end
            }
        else:
            return {"active": False}
    except Exception as e:
        logger.error(f"Get subscription error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8003"))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)