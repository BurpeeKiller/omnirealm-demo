'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('page.tsx');

export default function AuthCallbackPage() {
  const router = useRouter()
  const { success, error } = useToastStore()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer le code depuis les paramètres d'URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (!code) {
          error('Code de confirmation manquant')
          router.push('/login')
          return
        }

        // Échanger le code contre une session
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (authError) {
          logger.error('Erreur lors de la confirmation:', authError)
          error('Erreur lors de la confirmation du compte')
          router.push('/login')
          return
        }

        if (data.user) {
          success('Email confirmé avec succès ! Bienvenue sur OmniTask.')
          router.push('/dashboard')
        } else {
          error('Erreur lors de la confirmation')
          router.push('/login')
        }
      } catch (err) {
        logger.error('Erreur inattendue:', err)
        error('Erreur lors de la confirmation du compte')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router, success, error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Confirmation de votre compte...</p>
      </div>
    </div>
  )
}