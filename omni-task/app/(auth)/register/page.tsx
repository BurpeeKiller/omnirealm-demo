'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('page.tsx');

export default function RegisterPage() {
  const router = useRouter()
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      })

      if (signUpError) throw signUpError

      // Créer le profil utilisateur et l'accès app après l'inscription
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Utiliser la fonction SQL pour créer profil + accès app
        const { error: setupError } = await supabase.rpc('create_user_profile', {
          p_user_id: user.id,
          p_email: user.email!,
          p_full_name: formData.fullName,
          p_application_id: 'omnitask'
        })
        
        if (setupError) {
          logger.error('Erreur lors de la configuration du profil:', setupError)
          // Fallback: créer manuellement si la fonction RPC échoue
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: formData.fullName
          }).select()
          
          await supabase.from('user_applications').insert({
            user_id: user.id,
            application_id: 'omnitask',
            subscription_tier: 'free'
          }).select()
        }
      }

      success('Compte créé ! Vérifiez votre email pour confirmer.')
      router.push('/login')
    } catch (err: any) {
      error(err.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="color" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez OmniTask pour gérer vos projets intelligemment
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nom complet</label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jean Dupont"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mot de passe</label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                minLength={6}
              />
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}