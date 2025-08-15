/**
 * Configuration centralisée pour OmniScan Frontend
 * Utilise @omnirealm/config pour la validation
 */

import { z } from 'zod'
// Note: @omnirealm/config ne peut pas être utilisé côté client (utilise fs/path)

// Schéma de validation pour les variables d'environnement frontend
const envSchema = z.object({
  // Supabase - Public (optionnels avec avertissement)
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL').optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required').optional(),
  
  // Backend API
  VITE_BACKEND_URL: z.string().url().optional().default('http://localhost:8000'),
  VITE_API_URL: z.string().url().optional(), // Alias pour VITE_BACKEND_URL
  VITE_API_VERSION: z.string().optional().default('v1'),
  
  // App Info
  VITE_APP_NAME: z.string().optional().default('OmniScan'),
  VITE_APP_VERSION: z.string().optional().default('1.0.0'),
  VITE_PUBLIC_URL: z.string().url().optional(),
  VITE_SUPPORT_EMAIL: z.string().email().optional().default('support@omnirealm.tech'),
  
  // Feature Flags
  VITE_ENABLE_AI_ANALYSIS: z.enum(['true', 'false']).optional().default('true').transform(v => v === 'true'),
  VITE_ENABLE_BATCH_UPLOAD: z.enum(['true', 'false']).optional().default('true').transform(v => v === 'true'),
  VITE_ENABLE_EXPORT: z.enum(['true', 'false']).optional().default('true').transform(v => v === 'true'),
  VITE_ENABLE_CACHE: z.enum(['true', 'false']).optional().default('true').transform(v => v === 'true'),
  
  // Upload Config
  VITE_MAX_FILE_SIZE: z.string().optional().default('52428800').transform(Number), // 50MB default
  VITE_ALLOWED_FILE_TYPES: z.string().optional().default('.pdf,.jpg,.jpeg,.png,.gif,.webp,.tiff,.bmp'),
  
  // Analytics (optionnel)
  VITE_GA_TRACKING_ID: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Type exporté pour TypeScript
export type EnvConfig = z.infer<typeof envSchema>

// Pour Vite, on utilise directement import.meta.env sans Config class
// car Config utilise des modules Node.js non disponibles dans le navigateur
const rawConfig = import.meta.env as Record<string, string | undefined>

// Configuration validée et typée avec gestion d'erreur
let config: EnvConfig
try {
  config = envSchema.parse(rawConfig)
} catch (error) {
  console.error('❌ Configuration error:', error)
  // En production, on affiche un avertissement mais on continue avec des valeurs par défaut
  if (rawConfig.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: Missing environment variables in production. The app may not work correctly.')
    config = {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      VITE_BACKEND_URL: 'http://localhost:8000',
      VITE_API_VERSION: 'v1',
      VITE_APP_NAME: 'OmniScan',
      VITE_APP_VERSION: '1.0.0',
      VITE_SUPPORT_EMAIL: 'support@omnirealm.tech',
      VITE_ENABLE_AI_ANALYSIS: true,
      VITE_ENABLE_BATCH_UPLOAD: true,
      VITE_ENABLE_EXPORT: true,
      VITE_ENABLE_CACHE: true,
      VITE_MAX_FILE_SIZE: 52428800,
      VITE_ALLOWED_FILE_TYPES: '.pdf,.jpg,.jpeg,.png,.gif,.webp,.tiff,.bmp',
      NODE_ENV: 'production'
    } as EnvConfig
  } else {
    throw error
  }
}

export { config }

// Helper pour vérifier si on est en développement
export const isDevelopment = config.NODE_ENV === 'development'
export const isProduction = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'

// Configuration publique
export const publicConfig = {
  supabaseUrl: config.VITE_SUPABASE_URL,
  supabaseAnonKey: config.VITE_SUPABASE_ANON_KEY,
  backendUrl: config.VITE_API_URL || config.VITE_BACKEND_URL,
  apiVersion: config.VITE_API_VERSION,
  appName: config.VITE_APP_NAME,
  appVersion: config.VITE_APP_VERSION,
  publicUrl: config.VITE_PUBLIC_URL,
  supportEmail: config.VITE_SUPPORT_EMAIL
}

// Feature flags
export const features = {
  aiAnalysis: config.VITE_ENABLE_AI_ANALYSIS,
  batchUpload: config.VITE_ENABLE_BATCH_UPLOAD,
  export: config.VITE_ENABLE_EXPORT,
  cache: config.VITE_ENABLE_CACHE
}

// Upload config
export const uploadConfig = {
  maxFileSize: config.VITE_MAX_FILE_SIZE,
  allowedFileTypes: config.VITE_ALLOWED_FILE_TYPES.split(',').map(t => t.trim())
}

// Analytics config
export const analyticsConfig = {
  ga: config.VITE_GA_TRACKING_ID,
  posthog: config.VITE_POSTHOG_KEY,
  sentry: config.VITE_SENTRY_DSN
}