import { Upload } from '@/components/upload'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'

export function UploadPageNew() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            
            {user && (
              <span className="text-sm text-gray-600">
                Connecté en tant que {user.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Composant Upload unifié */}
      <Upload
        mode="page"
        features={{
          quota: true,
          apiKeys: true,
          navigation: false, // Navigation déjà gérée dans le header
          paywall: true,
          cache: true
        }}
        ui={{
          showHeader: true,
          showExamples: false,
          compactMode: false
        }}
        onUploadSuccess={(result) => {
          console.log('Upload réussi:', result)
          // Optionnel : rediriger vers la page de résultats
          // navigate(`/document/${result.id}`)
        }}
      />
    </div>
  )
}

// Export pour remplacer progressivement
export { UploadPageNew as UploadPage }