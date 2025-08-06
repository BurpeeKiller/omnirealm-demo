import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

import type { Database } from '../types/database.types';

/**
 * Client Supabase pour le serveur (Server Components, Route Handlers)
 * Gère automatiquement les cookies
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieOptions: ResponseCookie = {
              name,
              value,
              ...options,
              sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined,
            };
            cookieStore.set(cookieOptions);
          } catch (error) {
            // Le cookie store est read-only dans Server Components
            // Cette erreur est normale et peut être ignorée
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieOptions: ResponseCookie = {
              name,
              value: '',
              ...options,
              maxAge: 0,
              sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined,
            };
            cookieStore.set(cookieOptions);
          } catch (error) {
            // Le cookie store est read-only dans Server Components
          }
        },
      },
    },
  );
}

/**
 * Client admin avec service role key
 * À utiliser UNIQUEMENT côté serveur pour les opérations admin
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() {
          return '';
        },
        set() {},
        remove() {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
