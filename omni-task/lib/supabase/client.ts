import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { publicConfig } from '../config'

export function createClient() {
  return createBrowserClient<Database>(
    publicConfig.supabaseUrl,
    publicConfig.supabaseAnonKey
  )
}

// Export singleton pour compatibilité
export const supabase = createClient()

// Gestion des erreurs Supabase
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (error?.error_description) {
    return error.error_description
  }
  return 'Une erreur est survenue'
}