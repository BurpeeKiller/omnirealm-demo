/**
 * Client API unifié pour OmniScan
 * Remplace api.ts, api-simple.ts et api-unified.ts
 */

import axios, { AxiosInstance } from 'axios';
import { supabase } from './supabase';

// Types
export interface UploadOptions {
  detailLevel?: 'low' | 'medium' | 'high';
  language?: string;
  includeStructuredData?: boolean;
  chapterSummaries?: boolean;
  aiProvider?: string;
  apiKey?: string;
}

export interface UploadResult {
  document_id?: string;
  filename: string;
  extracted_text: string;
  ai_analysis: any;
  text_length: number;
  processing_time: {
    ocr?: number;
    ai?: number;
    total: number;
  };
  success: boolean;
  error?: string;
}

export interface BatchUploadResult {
  total: number;
  successful: number;
  failed: number;
  results: UploadResult[];
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes pour les longs traitements
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'auth
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré, déconnecter
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentification
  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuth() {
    this.authToken = null;
  }

  async initializeAuth() {
    // Récupérer le token depuis Supabase si disponible
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      this.setAuthToken(session.access_token);
    }
  }

  // Upload de documents
  async uploadDocument(
    file: File,
    options: UploadOptions = {},
    useSimpleMode: boolean = false
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Ajouter les options
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && key !== 'apiKey' && key !== 'aiProvider') {
        formData.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    };

    // Ajouter les headers pour l'AI si fournis
    if (options.aiProvider) {
      headers['X-AI-Provider'] = options.aiProvider;
    }
    if (options.apiKey) {
      headers['X-AI-Key'] = options.apiKey;
    }

    const endpoint = useSimpleMode || !this.authToken ? '/upload/simple' : '/upload';
    
    const response = await this.client.post<UploadResult>(endpoint, formData, {
      headers,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Émettre un événement de progression si nécessaire
          window.dispatchEvent(new CustomEvent('upload-progress', { detail: percentCompleted }));
        }
      },
    });

    return response.data;
  }

  async uploadBatch(
    files: File[],
    options: UploadOptions = {}
  ): Promise<BatchUploadResult> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Ajouter les options
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && key !== 'apiKey' && key !== 'aiProvider') {
        formData.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    };

    if (options.aiProvider) {
      headers['X-AI-Provider'] = options.aiProvider;
    }
    if (options.apiKey) {
      headers['X-AI-Key'] = options.apiKey;
    }

    const response = await this.client.post<BatchUploadResult>('/upload/batch', formData, {
      headers,
    });

    return response.data;
  }

  // Documents (historique)
  async getDocuments(limit: number = 10, offset: number = 0) {
    const response = await this.client.get('/documents', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getDocument(documentId: string) {
    const response = await this.client.get(`/documents/${documentId}`);
    return response.data;
  }

  async deleteDocument(documentId: string) {
    const response = await this.client.delete(`/documents/${documentId}`);
    return response.data;
  }

  // Export
  async exportDocument(documentId: string, format: 'pdf' | 'txt' | 'json') {
    const response = await this.client.get(`/export/${documentId}`, {
      params: { format },
      responseType: format === 'json' ? 'json' : 'blob',
    });
    
    if (format === 'json') {
      return response.data;
    }
    
    // Pour PDF et TXT, déclencher le téléchargement
    const blob = new Blob([response.data], {
      type: format === 'pdf' ? 'application/pdf' : 'text/plain',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${documentId}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Statistiques
  async getUserStats() {
    const response = await this.client.get('/stats/user');
    return response.data;
  }

  // AI Providers
  async getAIProviders() {
    const response = await this.client.get('/ai-providers');
    return response.data;
  }

  // Santé de l'API
  async checkHealth() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Authentification
  async sendMagicLink(email: string) {
    const response = await this.client.post('/auth/magic-link', { email });
    return response.data;
  }

  async verifyMagicLink(token: string) {
    const response = await this.client.post('/auth/verify', { token });
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout() {
    this.clearAuth();
    await supabase.auth.signOut();
  }
}

// Instance singleton
const apiClient = new ApiClient();

// Initialiser l'auth au chargement
apiClient.initializeAuth();

// Écouter les changements d'auth
supabase.auth.onAuthStateChange((_, session) => {
  if (session?.access_token) {
    apiClient.setAuthToken(session.access_token);
  } else {
    apiClient.clearAuth();
  }
});

export default apiClient;

// Export des fonctions pour compatibilité
export const uploadDocument = (file: File, options?: UploadOptions) => 
  apiClient.uploadDocument(file, options);

export const uploadDocumentSimple = (file: File, options?: UploadOptions) => 
  apiClient.uploadDocument(file, options, true);

export const uploadBatch = (files: File[], options?: UploadOptions) => 
  apiClient.uploadBatch(files, options);

export const getDocuments = (limit?: number, offset?: number) => 
  apiClient.getDocuments(limit, offset);

export const getDocument = (documentId: string) => 
  apiClient.getDocument(documentId);

export const exportDocument = (documentId: string, format: 'pdf' | 'txt' | 'json') => 
  apiClient.exportDocument(documentId, format);

export const getUserStats = () => 
  apiClient.getUserStats();

export const checkHealth = () => 
  apiClient.checkHealth();