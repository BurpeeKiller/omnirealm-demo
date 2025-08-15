/**
 * Configuration centralisée pour OmniTask
 * Utilise @omnirealm/config pour la validation
 */

import { z } from 'zod'
// Note: @omnirealm/config ne peut pas être utilisé côté client (utilise fs/path)

// Schéma de validation pour les variables d'environnement
const envSchema = z.object({
  // Supabase - Public
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  
  // Supabase - Privé (optionnel pour l'instant car non utilisé)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // OpenAI (optionnel car pas indispensable pour l'app de base)
  OPENAI_API_KEY: z.string().optional(),
  
  // App URL (optionnel pour l'instant car non utilisé)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Next.js config
  NEXT_TELEMETRY_DISABLED: z.enum(['1', '0']).optional().default('1'),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Type exporté pour TypeScript
export type EnvConfig = z.infer<typeof envSchema>

// Configuration pour Next.js
// Les variables NEXT_PUBLIC_* sont remplacées au build time
const getConfig = (): EnvConfig => {
  // Côté client, on ne peut accéder qu'aux variables NEXT_PUBLIC_*
  if (typeof window !== 'undefined') {
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: '', // Non disponible côté client
      OPENAI_API_KEY: '', // Non disponible côté client
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'production'
    }
  }
  
  // Côté serveur, on peut accéder à toutes les variables
  const parseResult = envSchema.safeParse(process.env)
  
  if (!parseResult.success) {
    console.error('❌ Configuration error:', parseResult.error.issues)
    
    // En développement, on crash pour forcer la configuration
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Missing required environment variables. Check .env file.')
    }
    
    // En production, on continue avec des valeurs par défaut
    console.error('⚠️ WARNING: Missing environment variables in production.')
  }
  
  return parseResult.success ? parseResult.data : {
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    OPENAI_API_KEY: '',
    NEXT_PUBLIC_APP_URL: '',
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'production'
  } as EnvConfig
}

export const config = getConfig()

// Helper pour vérifier si on est en développement
export const isDevelopment = config.NODE_ENV === 'development'
export const isProduction = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'

// Export des variables publiques pour le client
export const publicConfig = {
  supabaseUrl: config.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  appUrl: config.NEXT_PUBLIC_APP_URL
}

// Export des configurations serveur (seulement côté serveur)
export const serverConfig = {
  openaiApiKey: config.OPENAI_API_KEY,
  supabaseServiceRoleKey: config.SUPABASE_SERVICE_ROLE_KEY
}