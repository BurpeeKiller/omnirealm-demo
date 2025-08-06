"""
API d'authentification légère sans base de données
"""

from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from typing import Optional
from pydantic import BaseModel, EmailStr
import os
from app.services.auth_light import auth
from app.core.logging import get_logger
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()
logger = get_logger("auth")


class MagicLinkRequest(BaseModel):
    email: EmailStr


class VerifyTokenRequest(BaseModel):
    token: str


@router.post("/auth/magic-link")
async def send_magic_link(
    request: MagicLinkRequest,
    background_tasks: BackgroundTasks
):
    """Envoyer un lien magique par email"""
    
    # Créer le lien magique
    magic_link = auth.create_magic_link(request.email)
    
    # Envoyer l'email en arrière-plan
    background_tasks.add_task(
        send_email,
        request.email,
        "Votre lien de connexion OmniScan",
        f"""
        <h2>Connexion à OmniScan</h2>
        <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
        <p><a href="{magic_link}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Se connecter</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
        <p>Si vous n'avez pas demandé ce lien, ignorez cet email.</p>
        """
    )
    
    logger.info(f"Magic link sent to {request.email}")
    
    return {
        "success": True,
        "message": "Lien envoyé par email"
    }


@router.post("/auth/verify")
async def verify_magic_link(request: VerifyTokenRequest):
    """Vérifier le lien magique et créer une session"""
    
    # Vérifier le token
    email = auth.verify_magic_link(request.token)
    
    if not email:
        raise HTTPException(
            status_code=401,
            detail="Lien invalide ou expiré"
        )
    
    # Créer la session
    session_data = auth.create_session(email)
    
    logger.info(f"User {email} logged in via magic link")
    
    return session_data


@router.get("/auth/me")
async def get_current_user(
    authorization: Optional[str] = Header(None)
):
    """Récupérer les infos de l'utilisateur connecté"""
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Token requis"
        )
    
    token = authorization.split(" ")[1]
    user = auth.get_user(token)
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Token invalide"
        )
    
    # Vérifier le quota
    quota = auth.check_quota(user.get("email"))
    user["quota"] = quota
    
    return user


@router.post("/auth/increment-usage")
async def increment_usage(
    authorization: Optional[str] = Header(None)
):
    """Incrémenter le compteur d'usage après un scan"""
    
    if not authorization or not authorization.startswith("Bearer "):
        return {"success": False, "reason": "no_auth"}
    
    token = authorization.split(" ")[1]
    user = auth.get_user(token)
    
    if not user:
        return {"success": False, "reason": "invalid_token"}
    
    # Incrémenter
    success = auth.increment_usage(user.get("email"))
    
    if success:
        # Retourner le nouveau quota
        quota = auth.check_quota(user.get("email"))
        return {
            "success": True,
            "quota": quota
        }
    
    return {"success": False, "reason": "error"}


async def send_email(to_email: str, subject: str, html_content: str):
    """Envoyer un email (à configurer avec votre serveur SMTP)"""
    
    # Configuration SMTP
    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")
    
    if not SMTP_USER or not SMTP_PASS:
        # Mode demo - logger au lieu d'envoyer
        logger.info(f"[DEMO] Email to {to_email}: {subject}")
        logger.debug(f"[DEMO] Magic link content: {html_content}")
        return
    
    try:
        # Créer le message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        
        # Version texte
        text = f"""
        Connexion à OmniScan
        
        Copiez ce lien dans votre navigateur :
        {html_content.split('href="')[1].split('"')[0]}
        
        Ce lien expire dans 15 minutes.
        """
        
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html_content, "html")
        
        msg.attach(part1)
        msg.attach(part2)
        
        # Envoyer
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        
        logger.info(f"Email sent to {to_email}")
        
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        # Ne pas faire échouer la requête si l'email échoue