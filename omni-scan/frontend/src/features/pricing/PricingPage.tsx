import { Check, Zap, Shield, Clock, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@omnirealm/ui'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function PricingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuthStore()

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      // Demander de se connecter d'abord
      navigate('/?auth=true')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Rediriger vers Stripe
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choisissez votre plan OmniScan
          </h1>
          <p className="text-xl text-gray-600">
            OCR et analyse IA professionnels pour vos documents
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Plan Gratuit */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Gratuit</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-gray-600 mt-2">Pour essayer</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>5 scans par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>OCR basique</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Formats standards</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="w-5 h-5">✗</span>
                  <span>Analyse IA</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="w-5 h-5">✗</span>
                  <span>Export avancé</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => navigate('/')}
              >
                Commencer gratuitement
              </Button>
            </CardContent>
          </Card>

          {/* Plan Pro */}
          <Card className="relative border-blue-500 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-3 py-1">
                Populaire
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">49€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-gray-600 mt-2">Pour les professionnels</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Scans illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>OCR haute précision</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Analyse IA (GPT-4, Claude)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Export PDF, Word, Excel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCheckout('monthly')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Devenir Pro
              </Button>
            </CardContent>
          </Card>

          {/* Plan Entreprise */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">Sur devis</span>
              </div>
              <p className="text-gray-600 mt-2">Pour les équipes</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Tout du plan Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>API dédiée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Intégrations sur mesure</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Formation équipe</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>SLA garanti</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => window.location.href = 'mailto:contact@omniscan.app'}
              >
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir OmniScan Pro ?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">IA Avancée</h3>
              <p className="text-gray-600 text-sm">
                Analyse intelligente avec GPT-4 et Claude pour extraire l'essentiel
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Sécurisé</h3>
              <p className="text-gray-600 text-sm">
                Aucun stockage permanent, conforme RGPD
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Ultra Rapide</h3>
              <p className="text-gray-600 text-sm">
                Traitement en temps réel, résultats immédiats
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Support 24/7</h3>
              <p className="text-gray-600 text-sm">
                Équipe dédiée pour vous accompagner
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-gray-600">
                Oui, sans engagement. Vous pouvez annuler votre abonnement à tout moment depuis votre compte.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mes documents sont-ils stockés ?</h3>
              <p className="text-gray-600">
                Non, aucun document n'est conservé. Tout est traité en temps réel et immédiatement supprimé.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quels formats sont supportés ?</h3>
              <p className="text-gray-600">
                PDF, JPG, PNG, TIFF, BMP jusqu'à 50MB par fichier.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Retour à l'application
          </Button>
        </div>
      </div>
    </div>
  )
}