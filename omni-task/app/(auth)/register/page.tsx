'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@omnirealm/ui'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'

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
        },
      })

      if (signUpError) throw signUpError

      // Créer le profil utilisateur immédiatement après l'inscription
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: formData.fullName
          })
        
        if (profileError && profileError.code !== '23505') { // Ignorer si le profil existe déjà
          console.error('Erreur lors de la création du profil:', profileError)
        }

        // Créer aussi les préférences utilisateur
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id })
        
        if (prefsError && prefsError.code !== '23505') { // Ignorer si existe déjà
          console.error('Erreur lors de la création des préférences:', prefsError)
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
              <Label htmlFor="fullName">Nom complet</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Mot de passe</Label>
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