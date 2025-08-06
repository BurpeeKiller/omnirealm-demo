'use client'

import { useState } from 'react'
import { Button } from '@omnirealm/ui'
import { MessageSquare, X, Send } from 'lucide-react'

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setFeedback('')
    setIsOpen(false)
    setIsSubmitting(false)
    
    // TODO: Envoyer le feedback à votre API
    console.log('Feedback envoyé:', feedback)
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-40"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Widget de feedback */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold">Votre avis compte !</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comment pouvons-nous améliorer OmniTask ?
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Partagez vos idées, suggestions ou problèmes..."
              className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              required
            />
            <Button 
              type="submit" 
              className="w-full mt-3"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? (
                <>Envoi...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  )
}