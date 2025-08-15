'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'

export default function UnsubscribedPage() {
  const router = useRouter()
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [otherApps, setOtherApps] = useState<Array<{
    application_id: string
    name: string
    status: string
  }>>([])

  useEffect(() => {
    checkUserAndApps()
  }, [])

  const checkUserAndApps = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserEmail(user.email || '')
        
        // Vérifier les autres apps OmniRealm de l'utilisateur
        const { data: userApps } = await supabase
          .from('user_applications')
          .select('application_id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .neq('application_id', 'omnitask')

        if (userApps) {
          // Pour chaque app, récupérer son nom depuis la table applications
          const appsWithNames = await Promise.all(
            userApps.map(async (app) => {
              const { data: appData } = await supabase
                .from('applications')
                .select('name')
                .eq('id', app.application_id)
                .single()
              
              return {
                application_id: app.application_id,
                name: appData?.name || app.application_id,
                status: app.status
              }
            })
          )
          
          setOtherApps(appsWithNames)
        }
      }
    } catch (err) {
      // Erreur silencieuse pour la vérification
    }
  }

  const reactivateAccess = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { error: updateError } = await supabase
        .from('user_applications')
        .update({ 
          status: 'active',
          cancelled_at: null,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('application_id', 'omnitask')

      if (updateError) {
        error('Erreur lors de la réactivation')
      } else {
        success('Votre accès à OmniTask a été réactivé ! Redirection...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      error('Erreur lors de la réactivation')
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
          <CardTitle className="text-2xl font-bold text-green-600">
            Désinscription confirmée
          </CardTitle>
          <CardDescription>
            Vous êtes maintenant désinscrit d'OmniTask
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {userEmail && (
            <div className="text-sm text-gray-600 text-center">
              Compte : <span className="font-medium">{userEmail}</span>
            </div>
          )}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              ✅ Désinscription réussie
            </h3>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Vous n'avez plus accès à OmniTask</li>
              <li>• Vos données sont conservées 30 jours</li>
              <li>• Vous pouvez réactiver à tout moment</li>
              {otherApps.length > 0 && (
                <li>• Vos autres apps restent actives</li>
              )}
            </ul>
          </div>

          {otherApps.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                🔒 Vos autres applications OmniRealm
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                {otherApps.map(app => (
                  <li key={app.application_id}>
                    • {app.name} - <span className="font-medium">Actif</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Changé d'avis ? Vous pouvez réactiver votre accès immédiatement.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={reactivateAccess}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Réactivation...' : 'Réactiver mon accès à OmniTask'}
          </Button>
          
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Accueil
            </Button>
            
            <Button
              variant="outline"
              onClick={logout}
              className="flex-1"
            >
              Déconnexion
            </Button>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            Questions ? Contactez-nous à{' '}
            <a href="mailto:support@omnirealm.tech" className="text-blue-600 hover:underline">
              support@omnirealm.tech
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}