'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@omnirealm/ui'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/lib/store/toast-store'

export default function LoginPage() {
  const router = useRouter()
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setCheckingAuth(false)
      }
    }
    checkUser()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Logo variant="color" className="w-16 h-16 mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      console.log('Login successful:', data)
      
      success('Connexion réussie !')
      
      // Vérifier que la session est bien établie
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session after login:', session)
      
      if (session) {
        // Force le rafraîchissement pour déclencher le middleware
        router.refresh()
        // Redirection directe
        window.location.href = '/dashboard'
      } else {
        throw new Error('Session non établie après connexion')
      }
    } catch (err: any) {
      error(err.message || 'Erreur de connexion')
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
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte OmniTask
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}