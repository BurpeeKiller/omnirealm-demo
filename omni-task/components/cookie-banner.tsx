'use client'

import { useState, useEffect } from 'react'
import { Button } from '@omnirealm/ui'
import { Cookie } from 'lucide-react'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre{' '}
            <a href="/privacy" className="underline hover:text-gray-900 dark:hover:text-white">
              politique de confidentialité
            </a>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleReject}>
            Refuser
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  )
}