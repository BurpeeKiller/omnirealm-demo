import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '../types/database.types';

/**
 * Client Supabase pour le navigateur
 * Utilise les clés publiques uniquement
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'x-application': 'omnirealm',
        },
      },
    },
  );
}

// Export singleton pour réutilisation
let browserClient: ReturnType<typeof createClient> | undefined;

export function getClient() {
  if (!browserClient && typeof window !== 'undefined') {
    browserClient = createClient();
  }
  return browserClient!;
}
