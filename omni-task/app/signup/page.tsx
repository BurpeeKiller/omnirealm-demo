'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Card, Input, Label } from '@omnirealm/ui'
import { supabase } from '@/lib/supabase/client'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Inscription réussie !</h2>
          <p className="text-muted-foreground mb-4">
            Vérifiez votre email pour confirmer votre compte.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Retour à la connexion
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-muted-foreground mt-2">
            Commencez à booster votre productivité
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

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
                minLength={6}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 6 caractères
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </Card>
    </div>
  )
}