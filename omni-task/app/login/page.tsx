'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Input, Label } from '@omnirealm/ui'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/providers/toast-provider'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState('test@omnirealm.tech')
  const [password, setPassword] = useState('Test123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      success('Connexion réussie !')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.message || 'Erreur de connexion'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 page-transition">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous à votre compte OmniTask
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-900 font-medium">Compte de test</p>
          <p className="text-xs text-blue-700 mt-1">
            Email: test@omnirealm.tech<br />
            Mot de passe: Test123!
          </p>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </div>
      </Card>
    </div>
  )
}