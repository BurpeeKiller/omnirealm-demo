import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui'
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  CreditCard
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { getDocuments } from '@/services/api'


interface Stats {
  totalDocuments: number
  documentsUsed: number
  documentsQuota: number
  accuracy: number
  avgProcessingTime: number
  successRate: number
}

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalDocuments: 0,
    documentsUsed: 0,
    documentsQuota: 5,
    accuracy: 94.2,
    avgProcessingTime: 2.3,
    successRate: 98.5
  })
  const [recentDocuments, setRecentDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const docs = await getDocuments(user.id)
      setRecentDocuments(docs.slice(0, 3))
      
      // Calculer les stats
      const completed = docs.filter((d: any) => d.status === 'completed').length
      setStats(prev => ({
        ...prev,
        totalDocuments: docs.length,
        documentsUsed: docs.length,
        successRate: docs.length > 0 ? (completed / docs.length) * 100 : 0
      }))
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUserData()
  }, [user, fetchUserData])

  const quotaPercentage = (stats.documentsUsed / stats.documentsQuota) * 100
  const isQuotaExceeded = stats.documentsUsed >= stats.documentsQuota

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🔍 OmniScan Pro
              </h1>
              <Badge variant="secondary">v2.0</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Quota documents</p>
                <p className="text-lg font-semibold">
                  {stats.documentsUsed}/{stats.documentsQuota}
                </p>
                <Progress value={quotaPercentage} className="w-24 mt-1" />
              </div>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerte quota */}
        {isQuotaExceeded && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle>Quota atteint</AlertTitle>
            <AlertDescription>
              Vous avez utilisé tous vos documents gratuits. 
              <Button variant="link" className="px-2" onClick={() => navigate('/pricing')}>
                Passer au plan Pro →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs Navigation */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="scan">
              <FileText className="w-4 h-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="plans">
              <CreditCard className="w-4 h-4 mr-2" />
              Plans
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Documents traités
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                    +23% ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Précision OCR
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.accuracy}%</div>
                  <Progress value={stats.accuracy} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Temps moyen
                  </CardTitle>
                  <Clock className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgProcessingTime}s</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <Zap className="inline w-3 h-3 mr-1 text-yellow-500" />
                    2x plus rapide
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Commencez rapidement avec des modèles prédéfinis
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/upload')}
                  disabled={isQuotaExceeded}
                >
                  <FileText className="w-6 h-6" />
                  <span>Scan Facture</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/upload')}
                  disabled={isQuotaExceeded}
                >
                  <FileText className="w-6 h-6" />
                  <span>Scan Document ID</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/upload')}
                  disabled={isQuotaExceeded}
                >
                  <FileText className="w-6 h-6" />
                  <span>Traitement Batch</span>
                </Button>
              </CardContent>
            </Card>

            {/* Documents récents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents récents</CardTitle>
                <CardDescription>
                  Vos derniers documents traités
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-500">Chargement...</p>
                ) : recentDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.filename}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={doc.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {doc.status === 'completed' ? '✅ Terminé' : '🔄 En cours'}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                    >
                      Voir tous les documents →
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucun document traité pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scanner Tab */}
          <TabsContent value="scan">
            <Card>
              <CardHeader>
                <CardTitle>Scanner un document</CardTitle>
                <CardDescription>
                  Uploadez et analysez vos documents avec l&apos;IA
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <Button 
                  size="lg"
                  onClick={() => navigate('/upload')}
                  disabled={isQuotaExceeded}
                >
                  Commencer le scan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Gratuit</CardTitle>
                  <CardDescription>Pour essayer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-4">0€</p>
                  <ul className="space-y-2 text-sm">
                    <li>✅ 5 documents/mois</li>
                    <li>✅ OCR basique</li>
                    <li>✅ Analyse IA standard</li>
                    <li>❌ Export avancé</li>
                    <li>❌ API access</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Le plus populaire</CardDescription>
                  <Badge className="absolute top-4 right-4">Recommandé</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-4">29€<span className="text-sm font-normal">/mois</span></p>
                  <ul className="space-y-2 text-sm">
                    <li>✅ 100 documents/mois</li>
                    <li>✅ OCR avancé multilingue</li>
                    <li>✅ Analyse IA premium</li>
                    <li>✅ Export tous formats</li>
                    <li>✅ Support prioritaire</li>
                  </ul>
                  <Button className="w-full mt-4">
                    Passer au Pro
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Entreprise</CardTitle>
                  <CardDescription>Pour les équipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-4">99€<span className="text-sm font-normal">/mois</span></p>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Documents illimités</li>
                    <li>✅ API dédiée</li>
                    <li>✅ Intégrations custom</li>
                    <li>✅ Formation équipe</li>
                    <li>✅ SLA garanti</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Nous contacter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}