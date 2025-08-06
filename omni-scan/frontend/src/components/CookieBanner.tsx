import { useState, useEffect } from 'react'
import { Card, Button } from '@omnirealm/ui'
import { Cookie, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShow(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShow(false)
    // Désactiver les cookies non essentiels
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">🍪 Utilisation des cookies</h3>
              <p className="text-gray-600 mb-4">
                OmniScan utilise des cookies essentiels pour le fonctionnement du service 
                (authentification). Nous n'utilisons aucun cookie de tracking ou publicitaire.{' '}
                <Link to="/cookies" className="text-blue-600 hover:underline">
                  En savoir plus
                </Link>
              </p>
              <div className="flex gap-3">
                <Button onClick={handleAccept} size="sm">
                  Accepter
                </Button>
                <Button onClick={handleReject} variant="outline" size="sm">
                  Refuser les cookies non essentiels
                </Button>
              </div>
            </div>
            <button 
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}