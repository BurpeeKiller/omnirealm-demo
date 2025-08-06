import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  Badge,
  Skeleton,
  Progress
} from '@omnirealm/ui'
import { Upload, FileText, Loader2, CheckCircle2, Sparkles, Copy, Download, User, LogOut, Settings } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadDocumentSimple } from '@/services/api-simple'
import { useAuthStore } from '@/stores/authStore'
import { MagicLinkAuth } from '@/components/MagicLinkAuth'
import { QuotaLimit } from '@/components/QuotaLimit'
import { ApiKeyManager } from '@/components/ApiKeyManager'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ProcessingLoader } from '@/components/ProcessingLoader'
import { AnalysisConfigModal, AnalysisConfig } from '@/components/AnalysisConfigModal'
import { SimpleModal } from '@/components/SimpleModal'
import { StructuredDataDisplay } from '@/components/StructuredDataDisplay'
import { DocumentTypeBadge } from '@/components/DocumentTypeBadge'

export function UploadWithAuth() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showQuota, setShowQuota] = useState(false)
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [currentFileName, setCurrentFileName] = useState<string | undefined>()
  const [showAnalysisConfig, setShowAnalysisConfig] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | null>(null)
  
  const { user, isAuthenticated, logout, updateUsage } = useAuthStore()
  
  // Compteur local pour les non-connectés (stocké dans localStorage)
  const [localScansUsed, setLocalScansUsed] = useState(() => {
    const stored = localStorage.getItem('omniscan_scans_used')
    return stored ? parseInt(stored) : 0
  })

  // Vérifier le quota avant upload
  const checkQuota = () => {
    if (isAuthenticated && user) {
      return user.is_pro || user.scans_used < user.scans_limit
    } else {
      return localScansUsed < 10 // 10 scans gratuits sans connexion
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Vérifier le quota
    if (!checkQuota()) {
      setShowQuota(true)
      return
    }

    // Stocker le fichier et ouvrir le modal de configuration
    setPendingFile(file)
    setShowAnalysisConfig(true)
  }, [checkQuota])

  // Fonction pour lancer l'analyse après configuration
  const processFile = async (config: AnalysisConfig) => {
    if (!pendingFile) return

    setShowAnalysisConfig(false)
    setUploading(true)
    setError(null)
    setResult(null)
    setCurrentFileName(pendingFile.name)
    setAnalysisConfig(config)

    try {
      // Ajouter les options de configuration à l'upload
      const data = await uploadDocumentSimple(pendingFile, {
        detailLevel: config.detailLevel,
        language: config.language !== 'auto' ? config.language : undefined,
        includeStructuredData: config.includeStructuredData
      })
      setResult(data)
      
      // Incrémenter le compteur
      if (isAuthenticated && user) {
        updateUsage(user.scans_used + 1)
      } else {
        const newCount = localScansUsed + 1
        setLocalScansUsed(newCount)
        localStorage.setItem('omniscan_scans_used', newCount.toString())
      }
      
      // Nettoyer
      setPendingFile(null)
    } catch (err: any) {
      setError(err.message || err.response?.data?.detail || 'Erreur lors du traitement')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024
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

  const handleUpgrade = () => {
    // TODO: Intégrer Stripe checkout
    window.open('https://buy.stripe.com/test_omniscan', '_blank')
  }

  // Calculer les scans restants
  const getScansInfo = () => {
    if (isAuthenticated && user) {
      if (user.is_pro) {
        return { used: 0, limit: 0, remaining: -1, isPro: true }
      }
      return {
        used: user.scans_used,
        limit: user.scans_limit,
        remaining: user.scans_limit - user.scans_used,
        isPro: false
      }
    }
    return {
      used: localScansUsed,
      limit: 10,
      remaining: 10 - localScansUsed,
      isPro: false
    }
  }

  const scansInfo = getScansInfo()

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header avec compte utilisateur */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">OmniScan OCR</h1>
          <p className="text-gray-600">Extraction de texte intelligente par IA</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Bouton configuration API */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiConfig(!showApiConfig)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Clé API
          </Button>
          
          {/* Indicateur de quota */}
          {!scansInfo.isPro && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Scans restants</p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(scansInfo.used / scansInfo.limit) * 100} 
                  className="w-20 h-2"
                />
                <span className="text-sm font-medium">
                  {scansInfo.remaining}/{scansInfo.limit}
                </span>
              </div>
            </div>
          )}
          
          {/* Bouton utilisateur */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                {user.is_pro && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    Pro
                  </Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline"
              onClick={() => setShowAuth(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          )}
        </div>
      </div>

      {/* Configuration API Key */}
      {showApiConfig && (
        <ApiKeyManager onKeyUpdate={() => setShowApiConfig(false)} />
      )}

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
              
              {isDragActive ? (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-blue-500" />
                  <p className="text-lg font-medium text-blue-600">
                    Déposez le fichier ici
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Glissez-déposez un fichier ici
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
              <div className="mt-4">
                <ErrorMessage 
                  error={{ message: error }} 
                  onRetry={() => {
                    setError(null)
                    setResult(null)
                  }}
                />
              </div>
            )}

            {/* Message Pro pour non-connectés */}
            {!isAuthenticated && scansInfo.remaining <= 1 && (
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Il vous reste {scansInfo.remaining} scan{scansInfo.remaining > 1 ? 's' : ''} gratuit{scansInfo.remaining > 1 ? 's' : ''}.
                  <button 
                    className="font-medium underline ml-1"
                    onClick={() => setShowAuth(true)}
                  >
                    Connectez-vous
                  </button> pour plus de scans ou
                  <button 
                    className="font-medium underline ml-1"
                    onClick={handleUpgrade}
                  >
                    passez Pro
                  </button> pour un usage illimité.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Résultats (même code qu'avant) */}
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {result.filename}
                  </CardTitle>
                  {result.ai_analysis?.document_type && (
                    <div className="mt-2">
                      <DocumentTypeBadge 
                        type={result.ai_analysis.document_type}
                        confidence={result.ai_analysis.document_confidence}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
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

          {/* Affichage des données structurées extraites */}
          {result.ai_analysis?.structured_data && (
            <StructuredDataDisplay 
              data={result.ai_analysis.structured_data}
              type={result.ai_analysis.document_type}
            />
          )}

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

      {/* Modals */}
      <MagicLinkAuth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false)
          // TODO: Recharger les infos utilisateur
        }}
      />

      <QuotaLimit 
        isOpen={showQuota}
        onClose={() => setShowQuota(false)}
        onLogin={() => {
          setShowQuota(false)
          setShowAuth(true)
        }}
        onUpgrade={handleUpgrade}
        scansUsed={scansInfo.used}
        scansLimit={scansInfo.limit}
      />

      {/* Loader de traitement */}
      <ProcessingLoader 
        isProcessing={uploading} 
        fileName={currentFileName}
      />

      {/* Modal de configuration d'analyse */}
      {pendingFile && (
        <SimpleModal
          isOpen={showAnalysisConfig}
          onClose={() => {
            setShowAnalysisConfig(false)
            setPendingFile(null)
          }}
          onConfirm={processFile}
          fileName={pendingFile.name}
        />
      )}
    </div>
  )
}