import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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