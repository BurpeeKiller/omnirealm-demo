import { Zap, Shield, Clock, ArrowRight } from 'lucide-react'

export function WelcomeMessage() {
  return (
    <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Bienvenue sur OmniScan ! 🎉
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Transformez vos documents en données exploitables en quelques secondes
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Ultra-rapide</h3>
            <p className="text-sm text-gray-600">Analyse en 3-5 secondes</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">100% Sécurisé</h3>
            <p className="text-sm text-gray-600">Données chiffrées RGPD</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">10 scans gratuits</h3>
            <p className="text-sm text-gray-600">Sans carte bancaire</p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <ArrowRight className="w-4 h-4" />
          <span>Glissez votre document ci-dessous ou essayez un exemple</span>
        </div>
      </div>
    </div>
  )
}