import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  Badge,
  Skeleton
} from '@omnirealm/ui'
import { Upload, FileText, Loader2, CheckCircle2, Sparkles, Copy, Download } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadDocumentSimple } from '@/services/api-simple'

export function UploadSimple() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const data = await uploadDocumentSimple(file)
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du traitement')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadResult = () => {
    if (!result) return
    const blob = new Blob([result.extracted_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-${result.filename}.txt`
    a.click()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">OmniScan OCR</h1>
        <p className="text-gray-600">Extraction de texte intelligente par IA</p>
      </div>

      {/* Zone d'upload */}
      {!result && (
        <Card>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} disabled={uploading} />
              
              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                  <p className="text-gray-600">Traitement en cours...</p>
                  <p className="text-sm text-gray-500">OCR + Analyse IA</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez un fichier ici'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">ou cliquez pour sélectionner</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Formats supportés : PDF, JPG, PNG, TIFF, BMP (max 50MB)
                  </p>
                </div>
              )}
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {result && (
        <div className="space-y-6">
          {/* Infos du document */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {result.filename}
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Traité avec succès
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Caractères extraits :</span>
                  <span className="ml-2 font-medium">{result.text_length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Temps de traitement :</span>
                  <span className="ml-2 font-medium">{result.processing_time}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Texte extrait */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Texte extrait</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(result.extracted_text)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadResult}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{result.extracted_text}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Analyse IA */}
          {result.ai_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Analyse IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Résumé</h4>
                    <p className="text-gray-600">{result.ai_analysis.summary}</p>
                  </div>
                  {result.ai_analysis.key_points?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Points clés</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {result.ai_analysis.key_points.map((point: string, i: number) => (
                          <li key={i} className="text-gray-600">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nouveau scan */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => {
                setResult(null)
                setError(null)
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Scanner un autre document
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}