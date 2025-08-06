import axios from 'axios'

// En développement, utiliser le proxy Vite pour éviter les problèmes CORS
const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001')
  : '' // Vide = utilise le proxy Vite

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes de timeout
})

// Interface pour les options d'analyse
interface AnalysisOptions {
  detailLevel?: 'short' | 'medium' | 'detailed'
  language?: string
  includeStructuredData?: boolean
}

// Upload simple sans BD
export const uploadDocumentSimple = async (file: File, options: AnalysisOptions = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  
  // Ajouter les options d'analyse
  formData.append('detail_level', options.detailLevel || 'medium')
  if (options.language) {
    formData.append('language', options.language)
  }
  formData.append('include_structured_data', String(options.includeStructuredData ?? true))

  // Récupérer la clé API depuis le localStorage
  const provider = localStorage.getItem('ai_provider') || 'openai'
  const apiKey = localStorage.getItem(`${provider}_api_key`)

  console.log('Uploading file (simple mode):', file.name, 'Size:', file.size, 'Type:', file.type)
  console.log('API URL:', api.defaults.baseURL)
  console.log('AI Provider:', provider, 'Has key:', !!apiKey)
  console.log('Analysis options:', options)

  // Headers avec clé API si disponible
  const headers: any = {
    'Content-Type': 'multipart/form-data',
  }
  
  if (apiKey) {
    headers['X-AI-Provider'] = provider
    headers['X-AI-Key'] = apiKey
  }

  try {
    const response = await api.post('/upload/simple', formData, { headers })
    return response.data
  } catch (error: any) {
    console.error('Upload error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    })
    
    // Créer un message d'erreur plus clair
    if (error.response?.status === 413) {
      throw new Error('Fichier trop volumineux (max 50MB)')
    } else if (error.response?.status === 415) {
      throw new Error('Format de fichier non supporté')
    } else if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
      throw new Error('Erreur de connexion au serveur. Vérifiez que le backend est démarré.')
    } else {
      throw new Error(error.response?.data?.detail || error.message || 'Erreur lors du traitement')
    }
  }
}

// Pour la monétisation future
export const checkUserQuota = async (userId: string) => {
  // TODO: Implémenter avec auth légère
  return {
    used: 2,
    limit: 5,
    isSubscribed: false
  }
}

export const createCheckoutSession = async (plan: 'monthly' | 'yearly') => {
  // TODO: Intégration Stripe/LemonSqueezy
  return {
    url: 'https://checkout.stripe.com/...'
  }
}