'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('page.tsx');

export default function UnauthorizedPage() {
  const router = useRouter()
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
    }
    
    checkUser()
  }, [])

  const requestAccess = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Créer ou réactiver l'accès OmniTask pour cet utilisateur
      const { error: accessError } = await supabase.rpc('create_user_profile', {
        p_user_id: user.id,
        p_email: user.email!,
        p_full_name: user.user_metadata.full_name || '',
        p_application_id: 'omnitask'
      })

      if (accessError) {
        logger.error('Erreur lors de la création d\'accès:', accessError)
        error('Erreur lors de la demande d\'accès')
      } else {
        success('Accès à OmniTask activé ! Redirection...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      logger.error('Erreur inattendue:', err)
      error('Erreur lors de la demande d\'accès')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="color" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Accès non autorisé
          </CardTitle>
          <CardDescription>
            Vous n'avez pas accès à OmniTask avec ce compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {userEmail && (
            <div className="text-sm text-gray-600 text-center">
              Connecté en tant que : <span className="font-medium">{userEmail}</span>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Pourquoi ce message ?
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Votre compte n'est pas encore configuré pour OmniTask</li>
              <li>• Ou votre abonnement a été suspendu</li>
              <li>• Ou vous aviez désactivé l'accès à cette application</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={requestAccess}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Activation...' : 'Activer l\'accès gratuit à OmniTask'}
          </Button>
          
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              onClick={logout}
              className="flex-1"
            >
              Déconnexion
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Accueil
            </Button>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            Problème persistant ? Contactez-nous à{' '}
            <a href="mailto:support@omnirealm.tech" className="text-blue-600 hover:underline">
              support@omnirealm.tech
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}