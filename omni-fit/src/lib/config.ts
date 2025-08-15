/**
 * Configuration centralisée pour OmniFit
 * Utilise Zod pour la validation
 */

import { z } from 'zod'
// Note: @omnirealm/config ne peut pas être utilisé côté client (utilise fs/path)

// Schéma de validation pour les variables d'environnement frontend
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url().optional().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default(''),
  
  // Stripe Configuration
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'VITE_STRIPE_PUBLISHABLE_KEY is required'),
  STRIPE_SECRET_KEY: z.string().optional(), // Serveur uniquement
  STRIPE_WEBHOOK_SECRET: z.string().optional(), // Serveur uniquement
  
  // Stripe Price IDs
  VITE_STRIPE_PRICE_ID_MONTHLY: z.string().min(1, 'VITE_STRIPE_PRICE_ID_MONTHLY is required'),
  VITE_STRIPE_PRICE_ID_YEARLY: z.string().min(1, 'VITE_STRIPE_PRICE_ID_YEARLY is required'),
  
  // AI API Keys (optionnel - les utilisateurs peuvent utiliser leurs propres clés)
  VITE_OPENAI_API_KEY: z.string().optional(),
  VITE_ANTHROPIC_API_KEY: z.string().optional(),
  VITE_AI_API_URL: z.string().url().optional().default('http://localhost:11434/api/generate'),
  VITE_AI_API_KEY: z.string().optional(),
  VITE_JARVIS_ENABLED: z.enum(['true', 'false']).optional().default('false').transform(v => v === 'true'),
  
  // App Configuration
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  VITE_API_URL: z.string().url().default('http://localhost:8003'),
  
  // Analytics (optionnel)
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_GA_MEASUREMENT_ID: z.string().optional(),
  
  // LemonSqueezy (optionnel)
  VITE_LEMONSQUEEZY_STORE_ID: z.string().optional().default(''),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Type exporté pour TypeScript
export type EnvConfig = z.infer<typeof envSchema>

// Pour Vite, on utilise directement import.meta.env
const rawConfig = import.meta.env as Record<string, string | undefined>

// Configuration validée et typée
export const config = envSchema.parse(rawConfig)

// Helper pour vérifier si on est en développement
export const isDevelopment = config.NODE_ENV === 'development'
export const isProduction = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'

// Configuration publique
export const publicConfig = {
  supabaseUrl: config.VITE_SUPABASE_URL,
  supabaseAnonKey: config.VITE_SUPABASE_ANON_KEY,
  stripePublishableKey: config.VITE_STRIPE_PUBLISHABLE_KEY,
  stripePriceIdMonthly: config.VITE_STRIPE_PRICE_ID_MONTHLY,
  stripePriceIdYearly: config.VITE_STRIPE_PRICE_ID_YEARLY,
  appUrl: config.VITE_APP_URL,
  apiUrl: config.VITE_API_URL,
  openaiApiKey: config.VITE_OPENAI_API_KEY,
  anthropicApiKey: config.VITE_ANTHROPIC_API_KEY,
  aiApiUrl: config.VITE_AI_API_URL,
  aiApiKey: config.VITE_AI_API_KEY,
  jarvisEnabled: config.VITE_JARVIS_ENABLED
}

// Analytics config
export const analyticsConfig = {
  posthog: config.VITE_POSTHOG_KEY,
  ga: config.VITE_GA_MEASUREMENT_ID
}

// LemonSqueezy config
export const lemonSqueezyConfig = {
  storeId: config.VITE_LEMONSQUEEZY_STORE_ID
}