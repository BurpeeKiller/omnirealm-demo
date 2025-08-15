import axios, { AxiosInstance } from 'axios'
import { publicConfig, isProduction } from '@/lib/config'

// Configuration de base
const API_URL = isProduction 
  ? publicConfig.backendUrl
  : '' // Vide = utilise le proxy Vite

// Interface pour les options d'analyse
export interface AnalysisOptions {
  detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
  language?: string
  includeStructuredData?: boolean
  chapterSummaries?: boolean
}

// Types de réponse
export interface UploadResponse {
  success: boolean
  filename: string
  extracted_text: string
  ai_analysis: any
  text_length: number
  processing_time: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    is_pro: boolean
    scans_used: number
    scans_limit: number
  }
}

// Classe de service API unifiée
class ApiService {
  private api: AxiosInstance
  private authToken: string | null = null
  
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/${publicConfig.apiVersion}`,
      timeout: 30000,
    })
    
    // Intercepteur pour ajouter le token d'auth
    this.api.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`
      }
      
      // Ajouter la clé API personnalisée si présente
      const provider = localStorage.getItem('ai_provider') || 'openai'
      const apiKey = localStorage.getItem(`${provider}_api_key`)
      
      if (apiKey) {
        config.headers['X-AI-Provider'] = provider
        config.headers['X-AI-Key'] = apiKey
      }
      
      return config
    })
    
    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          this.clearAuth()
          window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(error)
      }
    )
  }
  
  // Méthodes d'authentification
  setAuthToken(token: string) {
    this.authToken = token
    localStorage.setItem('auth_token', token)
  }
  
  clearAuth() {
    this.authToken = null
    localStorage.removeItem('auth_token')
  }
  
  // Upload de document (mode simple sans auth)
  async uploadDocumentSimple(file: File, options: AnalysisOptions = {}): Promise<UploadResponse> {
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
    
    const response = await this.api.post<UploadResponse>('/upload/simple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    
    return response.data
  }
  
  // Upload de document (avec auth et sauvegarde)
  async uploadDocument(file: File, options: AnalysisOptions = {}): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value))
      }
    })
    
    const response = await this.api.post<UploadResponse>('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    
    return response.data
  }
  
  // Authentification
  async sendMagicLink(email: string): Promise<void> {
    await this.api.post('/auth/magic-link', { email })
  }
  
  async verifyMagicLink(token: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/verify-magic-link', { token })
    this.setAuthToken(response.data.access_token)
    return response.data
  }
  
  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await this.api.get<{ user: AuthResponse['user'] }>('/auth/me')
    return response.data.user
  }
  
  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout')
    } finally {
      this.clearAuth()
    }
  }
  
  // Stats et historique
  async getUserStats(): Promise<any> {
    const response = await this.api.get('/stats/user')
    return response.data
  }
  
  async getDocumentHistory(page = 1, limit = 10): Promise<any> {
    const response = await this.api.get('/documents', {
      params: { page, limit }
    })
    return response.data
  }
  
  // Export
  async exportDocument(documentId: string, format: 'pdf' | 'excel' | 'json' = 'pdf'): Promise<Blob> {
    const response = await this.api.get(`/document/${documentId}/export`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  }
  
  // Configuration
  async updateApiKey(provider: string, apiKey: string): Promise<void> {
    localStorage.setItem('ai_provider', provider)
    localStorage.setItem(`${provider}_api_key`, apiKey)
  }
  
  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await this.api.get('/health')
    return response.data
  }
}

// Instance singleton
export const apiService = new ApiService()

// Exports pour compatibilité
export const uploadDocumentSimple = (file: File, options?: AnalysisOptions) => 
  apiService.uploadDocumentSimple(file, options)

export const sendMagicLink = (email: string) => 
  apiService.sendMagicLink(email)

export const verifyMagicLink = (token: string) => 
  apiService.verifyMagicLink(token)