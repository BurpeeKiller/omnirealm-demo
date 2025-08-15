import axios from 'axios'
// Logger removed - using console instead
import { publicConfig } from '@/lib/config'

export const api = axios.create({
  baseURL: `${publicConfig.backendUrl}/api/${publicConfig.apiVersion}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const uploadDocument = async (file: File, userId?: string) => {
  const formData = new FormData()
  formData.append('file', file)
  if (userId) {
    formData.append('user_id', userId)
  }

  console.info('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)
  console.info('User ID:', userId)
  console.info('API URL:', api.defaults.baseURL)

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Upload error details:', error.response?.data || error.message)
    throw error
  }
}

export const getDocument = async (documentId: string) => {
  const response = await api.get(`/documents/${documentId}`)
  return response.data
}

export const getUserStats = async (userId: string) => {
  const response = await api.get(`/stats/user/${userId}`)
  return response.data
}

export const getDocuments = async (userId?: string, limit = 10, offset = 0) => {
  const params = new URLSearchParams()
  if (userId) params.append('user_id', userId)
  params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  
  const response = await api.get(`/documents?${params.toString()}`)
  return response.data
}