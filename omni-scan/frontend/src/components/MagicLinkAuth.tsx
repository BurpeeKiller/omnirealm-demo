import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { publicConfig } from '@/lib/config'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Alert,
  AlertDescription
} from '@/components/ui'

interface MagicLinkAuthProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function MagicLinkAuth({ isOpen, onClose, onSuccess: _onSuccess }: MagicLinkAuthProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${publicConfig.backendUrl}/api/${publicConfig.apiVersion}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSent(true)
      } else {
        setError('Erreur lors de l\'envoi du lien')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-2">Email envoyé !</DialogTitle>
            <DialogDescription className="text-base">
              Vérifiez votre boîte mail et cliquez sur le lien pour vous connecter.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Le lien expire dans 15 minutes
              </span>
            </DialogDescription>
            <Button 
              className="mt-6" 
              variant="outline"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connexion sans mot de passe</DialogTitle>
          <DialogDescription>
            Entrez votre email pour recevoir un lien de connexion magique
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Recevoir le lien magique'
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}