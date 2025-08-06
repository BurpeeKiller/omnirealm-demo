'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">
            🎉 Offre de lancement : -50% sur tous les plans pendant 3 mois !
          </span>
          <a href="/pricing" className="underline ml-1 font-semibold">
            En profiter →
          </a>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}