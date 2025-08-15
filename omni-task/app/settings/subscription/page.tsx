'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('page.tsx');

interface UserApplication {
  id: string
  application_id: string
  status: string
  subscription_tier: string
  external_subscription_id?: string
  subscribed_at: string
  cancelled_at?: string
  last_accessed_at: string
  subscription_ends_at?: string
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { success, error } = useToastStore()
  const [userApp, setUserApp] = useState<UserApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [unsubscribing, setUnsubscribing] = useState(false)

  useEffect(() => {
    fetchUserSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('user_applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('application_id', 'omnitask')
        .single()

      if (fetchError) {
        error('Erreur lors du chargement de l\'abonnement')
      } else {
        setUserApp(data)
      }
    } catch (err) {
      error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!userApp) return
    
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir vous désabonner d\'OmniTask ? ' +
      'Vous perdrez l\'accès à l\'application mais votre accès aux autres apps OmniRealm sera préservé.'
    )
    
    if (!confirmed) return

    setUnsubscribing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { error: updateError } = await supabase
        .from('user_applications')
        .update({ 
          status: 'inactive', 
          cancelled_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('application_id', 'omnitask')

      if (updateError) {
        error('Erreur lors de la désinscription')
      } else {
        success('Vous êtes maintenant désinscrit d\'OmniTask')
        router.push('/unsubscribed')
      }
    } catch (err) {
      error('Erreur lors de la désinscription')
    } finally {
      setUnsubscribing(false)
    }
  }

  const handleReactivate = async () => {
    if (!userApp) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

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
        logger.error('Erreur lors de la réactivation:', updateError)
        error('Erreur lors de la réactivation')
      } else {
        success('Votre accès à OmniTask a été réactivé')
        await fetchUserSubscription()
      }
    } catch (err) {
      logger.error('Erreur inattendue:', err)
      error('Erreur lors de la réactivation')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Annulé</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendu</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'free':
        return <Badge variant="outline">Gratuit</Badge>
      case 'basic':
        return <Badge className="bg-blue-100 text-blue-800">Basic</Badge>
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
      case 'enterprise':
        return <Badge className="bg-gold-100 text-gold-800">Enterprise</Badge>
      default:
        return <Badge variant="outline">{tier}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestion de l'abonnement</h1>
        <p className="text-gray-600 mt-2">
          Gérez votre abonnement à OmniTask
        </p>
      </div>

      {userApp ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              OmniTask
              {getStatusBadge(userApp.status)}
            </CardTitle>
            <CardDescription>
              Gestion de tâches IA-augmentée
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Abonnement</h3>
                <div className="mt-1">
                  {getTierBadge(userApp.subscription_tier)}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  {getStatusBadge(userApp.status)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Inscrit le</h3>
              <p className="text-sm text-gray-900">
                {new Date(userApp.subscribed_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {userApp.cancelled_at && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Annulé le</h3>
                <p className="text-sm text-gray-900">
                  {new Date(userApp.cancelled_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Dernier accès</h3>
              <p className="text-sm text-gray-900">
                {new Date(userApp.last_accessed_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {userApp.external_subscription_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID Abonnement</h3>
                <p className="text-sm text-gray-900 font-mono">
                  {userApp.external_subscription_id}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Retour au tableau de bord
            </Button>
            
            <div className="space-x-2">
              {userApp.status === 'active' ? (
                <Button
                  variant="destructive"
                  onClick={handleUnsubscribe}
                  disabled={unsubscribing}
                >
                  {unsubscribing ? 'Désinscription...' : 'Se désinscrire'}
                </Button>
              ) : (
                <Button
                  onClick={handleReactivate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Réactiver l'accès
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucun abonnement trouvé</CardTitle>
            <CardDescription>
              Vous n'avez pas d'abonnement à OmniTask
            </CardDescription>
          </CardHeader>
          
          <CardFooter>
            <Button onClick={() => router.push('/register')}>
              S'inscrire à OmniTask
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          🔒 Écosystème OmniRealm
        </h3>
        <p className="text-xs text-blue-700">
          Votre compte OmniRealm donne accès à plusieurs applications. 
          Se désabonner d'OmniTask ne supprime pas votre compte et 
          n'affecte pas vos autres abonnements (OmniFit, OmniScan, etc.).
        </p>
      </div>
    </div>
  )
}