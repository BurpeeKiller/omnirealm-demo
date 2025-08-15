import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui'
import { HardDrive, TrendingUp, Trash2, Clock } from 'lucide-react'
import { cacheService } from '@/services/cacheService'


interface CacheStatsData {
  totalSizeMB: string
  totalItems: number
  totalHits: number
  avgAccessCount: string
  usage: string
  topAccessed: Array<{
    fileName: string
    accessCount: number
    lastAccess: Date
  }>
}

export function CacheStats() {
  const [stats, setStats] = useState<CacheStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      const data = await cacheService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur chargement stats cache:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleClearCache = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider le cache ? Cette action est irréversible.')) {
      await cacheService.clear()
      await loadStats()
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
  }

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Cache OCR
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearCache}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Vider
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistiques principales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalSizeMB}MB</p>
            <p className="text-sm text-gray-500">Utilisé</p>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${stats.usage}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.totalItems}</p>
            <p className="text-sm text-gray-500">Documents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalHits}</p>
            <p className="text-sm text-gray-500">Hits cache</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.avgAccessCount}</p>
            <p className="text-sm text-gray-500">Accès moyen</p>
          </div>
        </div>

        {/* Top documents */}
        {stats.topAccessed.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Documents les plus consultés
            </h4>
            <div className="space-y-2">
              {stats.topAccessed.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{i + 1}
                    </Badge>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {doc.fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{doc.accessCount} accès</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.lastAccess).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info économies */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            💰 <strong>Économies estimées :</strong> {(stats.totalHits * 0.02).toFixed(2)}€ 
            <span className="text-green-600 ml-1">
              ({stats.totalHits} appels API économisés)
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}