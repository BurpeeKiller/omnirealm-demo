import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, Button } from '@omnirealm/ui'
import { useAuthStore } from '@/stores/authStore'

export function VerifyMagicLink() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Lien invalide')
        return
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (response.ok) {
          const data = await response.json()
          setAuth(data.token, data.user)
          setStatus('success')
          setMessage('Connexion réussie !')
          
          // Rediriger après 2 secondes
          setTimeout(() => navigate('/'), 2000)
        } else {
          setStatus('error')
          setMessage('Lien expiré ou invalide')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Erreur de connexion')
      }
    }

    verifyToken()
  }, [searchParams, setAuth, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Vérification en cours...</h2>
              <p className="text-gray-600">Veuillez patienter</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2">{message}</h2>
              <p className="text-gray-600 mb-4">Redirection en cours...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Erreur</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}