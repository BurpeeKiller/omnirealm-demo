'use client'

import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui'

export default function LogoTestPage() {
  const [animate, setAnimate] = useState(true)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-12">Test des variations de logo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Version couleur originale */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Version Couleur</h2>
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Petit (sm)</p>
              <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="sm" animate={animate} variant="color" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Moyen (md)</p>
              <div className="flex items-center justify-center w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="md" animate={animate} variant="color" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Grand (lg)</p>
              <div className="flex items-center justify-center w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="lg" animate={animate} variant="color" />
              </div>
            </div>
          </div>
        </div>

        {/* Version nuances de gris */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Version Nuances de Gris</h2>
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Petit (sm)</p>
              <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="sm" animate={animate} variant="grayscale" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Moyen (md)</p>
              <div className="flex items-center justify-center w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="md" animate={animate} variant="grayscale" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Grand (lg)</p>
              <div className="flex items-center justify-center w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="lg" animate={animate} variant="grayscale" />
              </div>
            </div>
          </div>
        </div>

        {/* Version noir et blanc */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Version Noir et Blanc</h2>
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Petit (sm)</p>
              <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="sm" animate={animate} variant="monochrome" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Moyen (md)</p>
              <div className="flex items-center justify-center w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="md" animate={animate} variant="monochrome" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 text-center">Grand (lg)</p>
              <div className="flex items-center justify-center w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                <Logo size="lg" animate={animate} variant="monochrome" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section animations */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Animations appliquées</h2>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">🌀</span>
              <div>
                <strong>Rotation orbitale :</strong> Les satellites tournent autour du centre (20s par tour complet)
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">💫</span>
              <div>
                <strong>Pulsation centrale :</strong> Le cercle central pulse doucement (échelle 1 → 1.1 → 1)
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">🎈</span>
              <div>
                <strong>Flottement des satellites :</strong> Chaque satellite flotte de haut en bas avec un délai différent
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Contrôles pour tester */}
      <div className="mt-8 text-center">
        <Button
          onClick={() => setAnimate(!animate)}
          variant="outline"
          size="lg"
        >
          {animate ? 'Arrêter les animations' : 'Démarrer les animations'}
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          {animate ? 'Animations activées' : 'Animations désactivées'}. Le logo montre l'interconnexion dynamique de l'écosystème OmniRealm.
        </p>
      </div>
    </div>
  )
}