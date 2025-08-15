import axios, { AxiosInstance, AxiosProgressEvent } from 'axios'
import { publicConfig, isProduction } from '@/lib/config'

// Types
export interface UploadOptions {
  detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
  language?: string
  includeStructuredData?: boolean
  chapterSummaries?: boolean
  useJobQueue?: boolean
  apiKey?: string
  provider?: string
}

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

export interface UploadResponse {
  job_id: string
  status: string
  message: string
  status_url: string
}

export interface QuotaInfo {
  used: number
  limit: number
  isSubscribed: boolean
  remaining: number
}

// Service unifié
export class UploadService {
  private client: AxiosInstance
  private apiUrl: string

  constructor() {
    this.apiUrl = isProduction ? publicConfig.backendUrl : ''
    this.client = axios.create({
      baseURL: `${this.apiUrl}/api/${publicConfig.apiVersion}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 300000, // 5 minutes
    })
  }

  // Upload avec ou sans job queue
  async upload(
    file: File, 
    options: UploadOptions = {},
    onProgress?: (event: AxiosProgressEvent) => void
  ): Promise<any> {
    const formData = this.createFormData(file, options)
    
    if (options.useJobQueue !== false) {
      return this.uploadWithJob(formData, onProgress)
    }
    
    return this.uploadDirect(formData, onProgress)
  }

  // Upload avec job queue et polling
  private async uploadWithJob(
    formData: FormData,
    onProgress?: (event: AxiosProgressEvent) => void
  ): Promise<any> {
    // Démarrer l'upload
    const headers = this.getHeaders(formData)
    const response = await this.client.post<UploadResponse>(
      '/upload/simple',
      formData,
      {
        headers,
        onUploadProgress: onProgress
      }
    )
    
    // Suivre le job
    return this.pollJobStatus(response.data.job_id)
  }

  // Upload direct (sans job queue)
  private async uploadDirect(
    formData: FormData,
    onProgress?: (event: AxiosProgressEvent) => void
  ): Promise<any> {
    const headers = this.getHeaders(formData)
    const response = await this.client.post(
      '/upload/direct',
      formData,
      {
        headers,
        onUploadProgress: onProgress
      }
    )
    
    return response.data
  }

  // Polling du statut d'un job
  async pollJobStatus(
    jobId: string,
    onStatusUpdate?: (status: JobStatus) => void,
    maxAttempts = 1800,
    interval = 500
  ): Promise<any> {
    let attempts = 0
    
    while (attempts < maxAttempts) {
      try {
        const status = await this.getJobStatus(jobId)
        
        if (onStatusUpdate) {
          onStatusUpdate(status)
        }
        
        if (status.status === 'completed') {
          return status.result
        }
        
        if (status.status === 'failed') {
          throw new Error(status.error || 'Le traitement a échoué')
        }
        
        if (status.status === 'cancelled') {
          throw new Error('Le traitement a été annulé')
        }
        
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

  // Récupérer le statut d'un job
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await this.client.get(`/job/${jobId}/status`)
    return response.data
  }

  // Vérifier les quotas utilisateur
  async checkQuota(): Promise<QuotaInfo> {
    const token = this.getAuthToken()
    
    if (!token) {
      return {
        used: 0,
        limit: 3,
        isSubscribed: false,
        remaining: 3
      }
    }
    
    try {
      const response = await this.client.get('/payment/check-subscription', {
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
        isSubscribed: false,
        remaining: 3
      }
    }
  }

  // Créer une session de paiement Stripe
  async createCheckoutSession() {
    const token = this.getAuthToken()
    
    if (!token) {
      throw new Error('Authentification requise')
    }
    
    const response = await this.client.post('/payment/create-checkout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    return response.data
  }

  // Helpers privés
  private createFormData(file: File, options: UploadOptions): FormData {
    const formData = new FormData()
    formData.append('file', file)
    
    // Options d'analyse
    formData.append('detail_level', options.detailLevel || 'medium')
    if (options.language) {
      formData.append('language', options.language)
    }
    formData.append('include_structured_data', String(options.includeStructuredData ?? true))
    if (options.chapterSummaries !== undefined) {
      formData.append('chapter_summaries', String(options.chapterSummaries))
    }
    
    return formData
  }

  private getHeaders(formData: FormData): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    }
    
    // Récupérer la clé API depuis localStorage ou options
    const provider = localStorage.getItem('ai_provider') || 'openai'
    const apiKey = localStorage.getItem(`${provider}_api_key`)
    
    if (apiKey) {
      headers['X-AI-Provider'] = provider
      headers['X-AI-Key'] = apiKey
    }
    
    return headers
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('omniscan_token')
  }
}

// Instance singleton
export const uploadService = new UploadService()