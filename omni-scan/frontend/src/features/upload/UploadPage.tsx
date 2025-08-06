import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  Badge,
  Progress,
  Skeleton
} from '@omnirealm/ui'
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { uploadDocument, getDocument } from '@/services/api'


export function UploadPage() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [document, setDocument] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const { user } = useAuth()

  // Log documentId en development
  useEffect(() => {
    if (documentId) {
      console.log('Document uploaded with ID:', documentId)
    }
  }, [documentId])

  const checkDocumentStatus = useCallback(async (id: string) => {
    try {
      const doc = await getDocument(id)
      setDocument(doc)
      
      // Simuler la progression
      if (doc.status === 'processing') {
        setProgress(prev => Math.min(prev + 10, 90))
        setTimeout(() => checkDocumentStatus(id), 2000)
      } else if (doc.status === 'completed') {
        setProgress(100)
      }
    } catch (err) {
      console.error('Erreur récupération document:', err)
    }
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setDocument(null)

    try {
      const result = await uploadDocument(file, user?.id)
      setDocumentId(result.id)
      
      // Commencer à vérifier le statut
      setTimeout(() => checkDocumentStatus(result.id), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }, [user, checkDocumentStatus])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Scanner un document</h1>
        </div>
      </div>

      {/* Zone de drop améliorée */}
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400'}
              ${uploading ? 'pointer-events-none opacity-75' : ''}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                <p className="text-lg font-medium">Upload en cours...</p>
                <Progress value={progress} className="max-w-xs mx-auto" />
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-4 text-lg font-medium">
                  {isDragActive
                    ? 'Déposez le fichier ici...'
                    : 'Glissez-déposez un fichier ici'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  ou <Button variant="link" className="px-1">parcourez vos fichiers</Button>
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  Formats supportés : PDF, JPG, PNG, TIFF, BMP (max 10MB)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Erreur améliorée */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Résultat amélioré */}
      {document && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <CardTitle>{document.filename}</CardTitle>
                </div>
                <Badge
                  variant={document.status === 'completed' ? 'default' : 
                          document.status === 'processing' ? 'secondary' : 'destructive'}
                >
                  {document.status === 'completed' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Terminé</>
                  ) : document.status === 'processing' ? (
                    <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> En cours...</>
                  ) : 'Erreur'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>

              {document.status === 'processing' ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : document.status === 'completed' && document.ai_analysis ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">📝 Résumé</h3>
                    <p className="text-gray-700 leading-relaxed">{document.ai_analysis.summary}</p>
                  </div>

                  {document.ai_analysis.key_points?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">🎯 Points clés</h3>
                      <div className="space-y-2">
                        {document.ai_analysis.key_points.map((point: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {document.ai_analysis.entities?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">🏷️ Entités détectées</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.ai_analysis.entities.map((entity: string, idx: number) => (
                          <Badge key={idx} variant="outline">{entity}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <details>
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        Voir le texte extrait complet
                      </summary>
                      <Card className="mt-4">
                        <CardContent className="p-4">
                          <pre className="text-sm whitespace-pre-wrap font-mono">
                            {document.extracted_text}
                          </pre>
                        </CardContent>
                      </Card>
                    </details>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                      Voir tous les documents
                    </Button>
                    <Button onClick={() => {
                      setDocument(null)
                      setDocumentId(null)
                      setProgress(0)
                      setError(null)
                    }}>
                      Scanner un autre document
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}