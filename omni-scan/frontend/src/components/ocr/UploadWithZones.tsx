import React, { useState, useCallback } from 'react'
import { Upload, FileText, Zap, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropZone } from '../upload/DropZone'
import { ImageZoneSelector } from './ImageZoneSelector'
import { ProcessingLoader } from '../ProcessingLoader'
import { ocrZonesService, OCRWithZonesResult } from '@/services/ocr-zones.service'
import { SelectedZone } from '@/types/ocr'
import { cn } from '@/lib/utils'

interface UploadWithZonesProps {
  className?: string
}

type UploadStep = 'upload' | 'zones' | 'processing' | 'results'

interface ProcessingState {
  isProcessing: boolean
  currentStep: string
  progress: number
  error?: string
}

export const UploadWithZones: React.FC<UploadWithZonesProps> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [selectedZones, setSelectedZones] = useState<SelectedZone[]>([])
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    currentStep: '',
    progress: 0
  })
  const [results, setResults] = useState<OCRWithZonesResult | null>(null)
  
  // Options de traitement
  const [includeFullImage, setIncludeFullImage] = useState(true)
  const [mergeResults, setMergeResults] = useState(true)
  const [language, setLanguage] = useState('auto')
  const [detailLevel, setDetailLevel] = useState<'short' | 'medium' | 'detailed' | 'high'>('medium')

  // Gérer l'upload de fichier
  const handleFileUpload = useCallback((files: File[]) => {
    if (files.length === 0) return

    const file = files[0]
    setUploadedFile(file)
    
    // Créer URL pour prévisualisation
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setCurrentStep('zones')
  }, [])

  // Gérer le changement de zones
  const handleZonesChange = useCallback((zones: SelectedZone[]) => {
    setSelectedZones(zones)
  }, [])

  // Démarrer le traitement OCR
  const startProcessing = useCallback(async () => {
    if (!uploadedFile) return

    setCurrentStep('processing')
    setProcessingState({
      isProcessing: true,
      currentStep: 'Préparation du traitement...',
      progress: 10
    })

    try {
      // Étape 1: Vérification des zones
      setProcessingState(prev => ({
        ...prev,
        currentStep: 'Analyse des zones sélectionnées...',
        progress: 25
      }))

      // Étape 2: Traitement OCR
      setProcessingState(prev => ({
        ...prev,
        currentStep: 'Extraction du texte en cours...',
        progress: 50
      }))

      const ocrResult = await ocrZonesService.processWithZones(uploadedFile, {
        zones: selectedZones,
        includeFullImage,
        mergeResults,
        language,
        detailLevel
      })

      // Étape 3: Finalisation
      setProcessingState(prev => ({
        ...prev,
        currentStep: 'Finalisation...',
        progress: 90
      }))

      setResults(ocrResult)
      setCurrentStep('results')

      setProcessingState(prev => ({
        ...prev,
        currentStep: 'Traitement terminé !',
        progress: 100,
        isProcessing: false
      }))

    } catch (error) {
      console.error('Erreur lors du traitement:', error)
      setProcessingState({
        isProcessing: false,
        currentStep: 'Erreur',
        progress: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    }
  }, [uploadedFile, selectedZones, includeFullImage, mergeResults, language, detailLevel])

  // Recommencer le processus
  const restart = useCallback(() => {
    setCurrentStep('upload')
    setUploadedFile(null)
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl('')
    setSelectedZones([])
    setResults(null)
    setProcessingState({
      isProcessing: false,
      currentStep: '',
      progress: 0
    })
  }, [imageUrl])

  // Passer à l'étape suivante sans zones
  const processWithoutZones = useCallback(() => {
    setSelectedZones([])
    startProcessing()
  }, [startProcessing])

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          OCR avec Sélection de Zones
        </CardTitle>
        
        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-2 text-sm">
          {['upload', 'zones', 'processing', 'results'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={cn(
                'px-3 py-1 rounded-full border',
                currentStep === step ? 'bg-blue-100 border-blue-300 text-blue-700' :
                ['zones', 'processing', 'results'].indexOf(currentStep) > index ? 'bg-green-100 border-green-300 text-green-700' :
                'bg-gray-100 border-gray-300 text-gray-500'
              )}>
                {index + 1}. {step === 'upload' ? 'Upload' : step === 'zones' ? 'Zones' : step === 'processing' ? 'Traitement' : 'Résultats'}
              </div>
              {index < 3 && <div className="w-2 h-px bg-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Étape 1: Upload */}
        {currentStep === 'upload' && (
          <div className="space-y-4">
            <DropZone
              onDrop={handleFileUpload}
              accept={{
                'application/pdf': ['.pdf'],
                'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
              }}
            />
            <p className="text-sm text-gray-600 text-center">
              Sélectionnez un document ou une image pour commencer l'analyse OCR avec sélection de zones
            </p>
          </div>
        )}

        {/* Étape 2: Sélection de zones */}
        {currentStep === 'zones' && imageUrl && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ImageZoneSelector
                  imageUrl={imageUrl}
                  onZonesChange={handleZonesChange}
                  maxZones={10}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Options de traitement</h3>
                  
                  {/* Langue */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Langue</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-détection</SelectItem>
                        <SelectItem value="fra">Français</SelectItem>
                        <SelectItem value="eng">Anglais</SelectItem>
                        <SelectItem value="deu">Allemand</SelectItem>
                        <SelectItem value="spa">Espagnol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Niveau de détail */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau de détail</label>
                    <Select value={detailLevel} onValueChange={(value: any) => setDetailLevel(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Rapide</SelectItem>
                        <SelectItem value="medium">Standard</SelectItem>
                        <SelectItem value="detailed">Détaillé</SelectItem>
                        <SelectItem value="high">Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Options avancées */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeFullImage}
                        onChange={(e) => setIncludeFullImage(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Inclure l'image complète</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={mergeResults}
                        onChange={(e) => setMergeResults(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Fusionner les résultats</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={startProcessing}
                    className="w-full"
                    disabled={selectedZones.length === 0 && !includeFullImage}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Démarrer l'OCR
                  </Button>
                  
                  {selectedZones.length === 0 && (
                    <Button
                      onClick={processWithoutZones}
                      variant="outline"
                      className="w-full"
                    >
                      Traiter l'image complète
                    </Button>
                  )}
                  
                  <Button
                    onClick={restart}
                    variant="outline"
                    className="w-full"
                  >
                    Nouveau document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Traitement */}
        {currentStep === 'processing' && (
          <ProcessingLoader
            stage={processingState.currentStep}
            progress={processingState.progress}
            error={processingState.error}
          />
        )}

        {/* Étape 4: Résultats */}
        {currentStep === 'results' && results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Résultats de l'extraction</h3>
              <div className="flex gap-2">
                <Button onClick={restart} variant="outline" size="sm">
                  Nouveau document
                </Button>
              </div>
            </div>

            {/* Résultats par zone */}
            {results.zones.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Zones sélectionnées ({results.zones.length})</h4>
                <div className="grid gap-4">
                  {results.zones.map((zoneResult) => (
                    <Card key={zoneResult.zoneId} className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded border mt-1"
                          style={{ backgroundColor: zoneResult.zone.color }}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{zoneResult.zone.label}</h5>
                            <span className="text-xs text-gray-500">
                              {Math.round(zoneResult.confidence * 100)}% confiance
                            </span>
                          </div>
                          <div className="text-sm bg-gray-50 p-3 rounded border">
                            {zoneResult.extractedText || 'Aucun texte détecté'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Résultat image complète */}
            {results.fullImageResult && (
              <div className="space-y-2">
                <h4 className="font-medium">Image complète</h4>
                <div className="text-sm bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto">
                  {results.fullImageResult.extractedText}
                </div>
              </div>
            )}

            {/* Résultat fusionné */}
            {results.mergedText && (
              <div className="space-y-2">
                <h4 className="font-medium">Texte fusionné</h4>
                <div className="text-sm bg-blue-50 p-4 rounded border max-h-60 overflow-y-auto">
                  {results.mergedText}
                </div>
              </div>
            )}

            {/* Métadonnées */}
            <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
              Traité en {results.totalProcessingTime.toFixed(2)}s • {results.filename}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}