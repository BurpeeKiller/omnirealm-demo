import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Upload, Zap, Shield, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SimpleLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            OmniScan Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transformez vos documents en données exploitables avec l&apos;IA
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/upload')}
            className="text-lg px-8 py-6"
          >
            <Upload className="w-5 h-5 mr-2" />
            Scanner un document maintenant
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-yellow-500 mb-4" />
              <CardTitle>Ultra Rapide</CardTitle>
              <CardDescription>
                Traitement en moins de 3 secondes avec notre IA optimisée
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-green-500 mb-4" />
              <CardTitle>100% Sécurisé</CardTitle>
              <CardDescription>
                Vos documents sont chiffrés et supprimés après traitement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="w-10 h-10 text-blue-500 mb-4" />
              <CardTitle>Multi-langues</CardTitle>
              <CardDescription>
                Support de 12 langues dont français, anglais, espagnol
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-gray-600 mb-6">
                Essayez gratuitement avec 5 documents par mois
              </p>
              <div className="space-x-4">
                <Button size="lg" onClick={() => navigate('/upload')}>
                  Essayer maintenant
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}