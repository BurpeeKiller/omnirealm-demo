import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createLogger } from '@/lib/logger'
const logger = createLogger('middleware.ts');
import { publicConfig } from './lib/config'

// Rate limiting - Simple in-memory store (pour production, utiliser Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Nettoyer les entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

function rateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const resetTime = now + windowMs
  
  const current = rateLimitStore.get(ip)
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  return true
}

export async function middleware(request: NextRequest) {
  // Headers de sécurité
  const headers = new Headers(request.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.supabase.omnirealm.tech",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.supabase.omnirealm.tech wss://api.supabase.omnirealm.tech",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  headers.set('Content-Security-Policy', csp)
  
  // Rate limiting pour les routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString()
        }
      })
    }
  }

  // Créer le client Supabase
  let response = NextResponse.next({
    request: {
      headers,
    },
  })

  const supabase = createServerClient(
    publicConfig.supabaseUrl,
    publicConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _ }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/privacy', '/logo-test', '/api/auth/callback']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!isPublicRoute) {
    // Vérifier l'authentification
    const { data: { user }, error } = await supabase.auth.getUser()

    // Si pas d'utilisateur, rediriger vers login
    if (!user || error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Vérifier l'accès à OmniTask via l'architecture multi-tenant
    try {
      const { data: hasAccess, error: accessError } = await supabase
        .rpc('user_has_access', { 
          p_user_id: user.id, 
          p_application_id: 'omnitask' 
        })

      if (accessError) {
        logger.error('Erreur vérification accès:', accessError)
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Si l'utilisateur n'a pas accès, rediriger vers unauthorized
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Mettre à jour last_accessed_at
      await supabase
        .from('user_applications')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('application_id', 'omnitask')

    } catch (err) {
      logger.error('Erreur middleware:', err)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Ajouter les headers de sécurité à la réponse
  Object.entries(Object.fromEntries(headers.entries())).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}