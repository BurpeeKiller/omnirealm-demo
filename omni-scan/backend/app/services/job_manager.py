"""
Gestionnaire de jobs pour suivre la progression des tâches
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from enum import Enum
import asyncio

from app.core.logging import get_logger

logger = get_logger("job_manager")


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class JobType(str, Enum):
    OCR = "ocr"
    AI_ANALYSIS = "ai_analysis"
    UPLOAD = "upload"


class Job:
    """Représente un job en cours"""
    
    def __init__(self, job_type: JobType, total_steps: int = 0):
        self.id = str(uuid.uuid4())
        self.type = job_type
        self.status = JobStatus.PENDING
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        
        # Progression
        self.current_step = 0
        self.total_steps = total_steps
        self.progress_percentage = 0
        self.current_message = ""
        
        # Résultats et erreurs
        self.result: Optional[Dict[str, Any]] = None
        self.error: Optional[str] = None
        
        # Métadonnées
        self.metadata: Dict[str, Any] = {}
    
    def start(self):
        """Démarre le job"""
        self.status = JobStatus.PROCESSING
        self.started_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def update_progress(self, current_step: int, message: str = ""):
        """Met à jour la progression"""
        self.current_step = current_step
        self.current_message = message
        if self.total_steps > 0:
            self.progress_percentage = int((current_step / self.total_steps) * 100)
        self.updated_at = datetime.utcnow()
    
    def complete(self, result: Optional[Dict[str, Any]] = None):
        """Marque le job comme terminé"""
        self.status = JobStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.progress_percentage = 100
        if result:
            self.result = result
    
    def fail(self, error: str):
        """Marque le job comme échoué"""
        self.status = JobStatus.FAILED
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.error = error
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertit le job en dictionnaire"""
        return {
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "progress": {
                "current": self.current_step,
                "total": self.total_steps,
                "percentage": self.progress_percentage,
                "message": self.current_message
            },
            "result": self.result,
            "error": self.error,
            "metadata": self.metadata
        }


class JobManager:
    """Gestionnaire singleton pour les jobs"""
    
    _instance = None
    _jobs: Dict[str, Job] = {}
    _cleanup_task = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JobManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._jobs = {}
            self._initialized = True
            logger.info("JobManager initialized")
    
    async def start_cleanup_task(self):
        """Démarre la tâche de nettoyage périodique"""
        if not self._cleanup_task:
            self._cleanup_task = asyncio.create_task(self._cleanup_old_jobs())
    
    async def _cleanup_old_jobs(self):
        """Nettoie les jobs anciens (> 1 heure)"""
        while True:
            try:
                await asyncio.sleep(300)  # Toutes les 5 minutes
                
                now = datetime.utcnow()
                cutoff = now - timedelta(hours=1)
                
                jobs_to_remove = []
                for job_id, job in self._jobs.items():
                    if job.completed_at and job.completed_at < cutoff:
                        jobs_to_remove.append(job_id)
                
                for job_id in jobs_to_remove:
                    del self._jobs[job_id]
                    
                if jobs_to_remove:
                    logger.info(f"Cleaned up {len(jobs_to_remove)} old jobs")
                    
            except Exception as e:
                logger.error(f"Error in cleanup task: {e}")
    
    def create_job(self, job_type: JobType, total_steps: int = 0) -> Job:
        """Crée un nouveau job"""
        job = Job(job_type, total_steps)
        self._jobs[job.id] = job
        logger.info(f"Created job {job.id} of type {job_type}")
        return job
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Récupère un job par son ID"""
        return self._jobs.get(job_id)
    
    def update_job_progress(self, job_id: str, current_step: int, message: str = ""):
        """Met à jour la progression d'un job"""
        job = self.get_job(job_id)
        if job:
            job.update_progress(current_step, message)
            logger.debug(f"Updated job {job_id}: step {current_step}/{job.total_steps} - {message}")
    
    def complete_job(self, job_id: str, result: Optional[Dict[str, Any]] = None):
        """Marque un job comme terminé"""
        job = self.get_job(job_id)
        if job:
            job.complete(result)
            logger.info(f"Completed job {job_id}")
    
    def fail_job(self, job_id: str, error: str):
        """Marque un job comme échoué"""
        job = self.get_job(job_id)
        if job:
            job.fail(error)
            logger.error(f"Failed job {job_id}: {error}")
    
    def get_all_jobs(self, status: Optional[JobStatus] = None) -> Dict[str, Job]:
        """Récupère tous les jobs ou ceux d'un statut spécifique"""
        if status:
            return {k: v for k, v in self._jobs.items() if v.status == status}
        return self._jobs.copy()


# Instance globale
job_manager = JobManager()