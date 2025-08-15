"""Endpoints pour les statistiques utilisateur"""

from fastapi import APIRouter, HTTPException, status
from app.utils.logger import logger
from datetime import datetime

from app.core.database import get_supabase
from app.schemas.stats import UserStats

router = APIRouter()


@router.get("/stats/user/{user_id}", response_model=UserStats)
async def get_user_stats(user_id: str):
    """Récupérer les statistiques d'un utilisateur"""
    try:
        supabase = get_supabase()
        
        # Récupérer le profil utilisateur
        user_response = supabase.table("user_profiles").select("*").eq("id", user_id).execute()
        if not user_response.data:
            # Créer un profil par défaut
            user_profile = {
                "id": user_id,
                "documents_used": 0,
                "documents_quota": 5,
                "subscription_plan": "free"
            }
            supabase.table("user_profiles").insert(user_profile).execute()
        else:
            user_profile = user_response.data[0]
        
        # Récupérer les documents de l'utilisateur
        docs_response = supabase.table("documents").select("*").eq("user_id", user_id).execute()
        documents = docs_response.data if docs_response.data else []
        
        # Calculer les statistiques
        total_documents = len(documents)
        # completed_documents = len([d for d in documents if d.get("status") == "completed"])
        # success_rate et avg_processing_time seront utilisés plus tard
        # success_rate = (completed_documents / total_documents * 100) if total_documents > 0 else 0
        # avg_processing_time = 2.3
        
        # Documents ce mois
        # now = datetime.utcnow()
        # month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # monthly_docs = len([
        #     d for d in documents 
        #     if datetime.fromisoformat(d.get("created_at", "").replace("Z", "")) >= month_start
        # ])
        # 
        # # Calcul de la tendance (simplifié)
        # last_month_start = (month_start - timedelta(days=1)).replace(day=1)
        # last_month_docs = len([
        #     d for d in documents 
        #     if last_month_start <= datetime.fromisoformat(d.get("created_at", "").replace("Z", "")) < month_start
        # ])
        
        # trend_percentage sera utilisé plus tard
        # trend_percentage = 0
        # if last_month_docs > 0:
        #     trend_percentage = ((monthly_docs - last_month_docs) / last_month_docs) * 100
        # elif monthly_docs > 0:
        #     trend_percentage = 100
        
        # Calculer le pourcentage d'usage
        documents_used = user_profile.get("documents_used", 0)
        documents_quota = user_profile.get("documents_quota", 5)
        usage_percentage = (documents_used / documents_quota * 100) if documents_quota > 0 else 0
        
        # Trouver la dernière date d'upload
        last_upload = None
        if documents:
            sorted_docs = sorted(documents, key=lambda d: d.get("created_at", ""), reverse=True)
            if sorted_docs:
                last_upload = datetime.fromisoformat(sorted_docs[0].get("created_at", "").replace("Z", ""))
        
        return UserStats(
            user_id=user_id,
            total_documents=total_documents,
            documents_used=documents_used,
            documents_quota=documents_quota,
            usage_percentage=round(usage_percentage, 1),
            subscription_tier=user_profile.get("subscription_tier", "free"),
            last_upload=last_upload
        )
        
    except Exception as e:
        logger.info(f"Erreur récupération stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des statistiques"
        )

