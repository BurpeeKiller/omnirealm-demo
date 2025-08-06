import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '../types/database.types';

/**
 * Middleware Supabase pour Next.js
 * Gère le refresh automatique des sessions
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Définir le cookie sur la requête et la réponse
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Supprimer le cookie sur la requête et la réponse
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  // Rafraîchir la session si elle existe
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection des routes (optionnel - à adapter selon vos besoins)
  const protectedPaths = ['/dashboard', '/admin', '/api/protected'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !user) {
    // Rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return response;
}
