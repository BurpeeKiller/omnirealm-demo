import axios from 'axios'
// Logger removed - using console instead
import { publicConfig, isProduction } from '@/lib/config'

// En développement, utiliser le proxy Vite pour éviter les problèmes CORS
const API_URL = isProduction 
  ? publicConfig.backendUrl
  : '' // Vide = utilise le proxy Vite

export const api = axios.create({
  baseURL: `${API_URL}/api/${publicConfig.apiVersion}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes de timeout pour les longs traitements
})

// Interface pour les options d'analyse
interface AnalysisOptions {
  detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
  language?: string
  includeStructuredData?: boolean
  chapterSummaries?: boolean
}

// Interface pour le job status
export interface JobStatus {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  updated_at: string
  started_at?: string
  completed_at?: string
  progress: {
    current: number
    total: number
    percentage: number
    message: string
  }
  result?: any
  error?: string
  metadata?: any
}

// Interface pour la réponse initiale d'upload
interface UploadResponse {
  job_id: string
  status: string
  message: string
  status_url: string
}

// Récupérer le statut d'un job
export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await api.get(`/job/${jobId}/status`)
  return response.data
}

// Upload avec suivi de progression
export const uploadDocumentWithProgress = async (
  file: File, 
  options: AnalysisOptions = {},
  onProgress?: (status: JobStatus) => void
): Promise<any> => {
  // D'abord, lancer l'upload
  const uploadResponse = await startUpload(file, options)
  
  // Ensuite, suivre la progression
  return pollJobStatus(uploadResponse.job_id, onProgress)
}

// Démarrer l'upload (retourne immédiatement un job ID)
const startUpload = async (file: File, options: AnalysisOptions = {}): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  
  // Ajouter les options d'analyse
  formData.append('detail_level', options.detailLevel || 'medium')
  if (options.language) {
    formData.append('language', options.language)
  }
  formData.append('include_structured_data', String(options.includeStructuredData ?? true))
  if (options.chapterSummaries !== undefined) {
    formData.append('chapter_summaries', String(options.chapterSummaries))
  }

  // Récupérer la clé API depuis le localStorage
  const provider = localStorage.getItem('ai_provider') || 'openai'
  const apiKey = localStorage.getItem(`${provider}_api_key`)

  console.info('Starting file upload:', file.name, 'Size:', file.size, 'Type:', file.type)
  console.info('AI Provider:', provider, 'Has key:', !!apiKey)

  // Headers avec clé API si disponible
  const headers: any = {
    'Content-Type': 'multipart/form-data',
  }
  
  if (apiKey) {
    headers['X-AI-Provider'] = provider
    headers['X-AI-Key'] = apiKey
  }

  const response = await api.post('/upload/simple', formData, { headers })
  return response.data
}

// Suivre le statut d'un job avec polling
const pollJobStatus = async (
  jobId: string, 
  onProgress?: (status: JobStatus) => void,
  maxAttempts = 1800, // 30 minutes max (pour PDFs longs)
  interval = 500 // 0.5 seconde pour plus de réactivité
): Promise<any> => {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const status = await getJobStatus(jobId)
      
      // Callback de progression
      if (onProgress) {
        onProgress(status)
      }
      
      console.info(`Job ${jobId} - Status: ${status.status}, Progress: ${status.progress.percentage}%`)
      
      // Si terminé, retourner le résultat
      if (status.status === 'completed') {
        return status.result
      }
      
      // Si échoué, lancer une erreur
      if (status.status === 'failed') {
        throw new Error(status.error || 'Le traitement a échoué')
      }
      
      // Si annulé
      if (status.status === 'cancelled') {
        throw new Error('Le traitement a été annulé')
      }
      
      // Attendre avant la prochaine vérification
      await new Promise(resolve => setTimeout(resolve, interval))
      attempts++
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Job introuvable')
      }
      throw error
    }
  }
  
  throw new Error('Timeout: le traitement a pris trop de temps')
}

// Upload simple sans BD (ancienne méthode pour compatibilité)
export const uploadDocumentSimple = async (file: File, options: AnalysisOptions = {}) => {
  console.warn('uploadDocumentSimple est déprécié. Utilisez uploadDocumentWithProgress')
  return uploadDocumentWithProgress(file, options)
}

// API de monétisation
export const checkUserQuota = async () => {
  const token = localStorage.getItem('omniscan_token')
  if (!token) {
    return {
      used: 0,
      limit: 3,
      isSubscribed: false
    }
  }
  
  try {
    const response = await api.get('/payment/check-subscription', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return {
      used: response.data.scans_used,
      limit: response.data.scans_limit,
      isSubscribed: response.data.is_pro,
      remaining: response.data.scans_remaining
    }
  } catch (error) {
    console.error('Erreur vérification quota:', error)
    return {
      used: 0,
      limit: 3,
      isSubscribed: false
    }
  }
}

export const createCheckoutSession = async () => {
  const token = localStorage.getItem('omniscan_token')
  if (!token) {
    throw new Error('Authentification requise')
  }
  
  try {
    const response = await api.post('/payment/create-checkout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Erreur création paiement:', error)
    throw error
  }
}

export const checkSubscription = async () => {
  const token = localStorage.getItem('omniscan_token')
  if (!token) {
    return {
      is_pro: false,
      scans_used: 0,
      scans_limit: 3,
      scans_remaining: 3,
      reason: 'no_token'
    }
  }
  
  try {
    const response = await api.get('/payment/check-subscription', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Erreur vérification abonnement:', error)
    return {
      is_pro: false,
      scans_used: 0,
      scans_limit: 3,
      scans_remaining: 3,
      reason: 'error'
    }
  }
}