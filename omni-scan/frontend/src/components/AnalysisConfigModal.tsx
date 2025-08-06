import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Label,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Alert,
  AlertDescription
} from '@omnirealm/ui'
import { RadioGroup, RadioGroupItem } from './RadioGroup'
import { 
  Settings2, 
  FileText, 
  Zap, 
  FileSearch, 
  Languages,
  Sparkles,
  Info,
  CheckCircle,
  Brain
} from 'lucide-react'

interface AnalysisConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (config: AnalysisConfig) => void
  fileName: string
  fileSize: number
  fileType: string
}

export interface AnalysisConfig {
  detailLevel: 'short' | 'medium' | 'detailed'
  includeStructuredData: boolean
  language: string
  aiProvider: string
  exportFormat: string[]
  autoDetectType: boolean
}

export function AnalysisConfigModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fileName,
  fileSize,
  fileType
}: AnalysisConfigModalProps) {
  const [config, setConfig] = useState<AnalysisConfig>({
    detailLevel: 'medium',
    includeStructuredData: true,
    language: 'auto',
    aiProvider: 'openai',
    exportFormat: ['text'],
    autoDetectType: true
  })

  const handleConfirm = () => {
    onConfirm(config)
  }

  const updateConfig = (key: keyof AnalysisConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" aria-labelledby="dialog-title">
        <DialogHeader className="">
          <DialogTitle id="dialog-title" className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Configurer l'analyse
          </DialogTitle>
          <DialogDescription>
            Personnalisez l'analyse pour obtenir les meilleurs résultats
          </DialogDescription>
        </DialogHeader>

        {/* Info sur le fichier */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-medium text-sm">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {fileType.toUpperCase()} • {formatFileSize(fileSize)}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              ~3-5 sec
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="extraction">Extraction</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Onglet Analyse */}
          <TabsContent value="analysis" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Niveau de détail */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Niveau de détail de l'analyse
                </Label>
                <RadioGroup 
                  value={config.detailLevel} 
                  onValueChange={(value: string) => updateConfig('detailLevel', value as 'short' | 'medium' | 'detailed')}
                >
                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer">
                      <div className={`border rounded-lg p-3 transition-colors ${
                        config.detailLevel === 'short' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="short" id="short" className="sr-only" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Court</p>
                          <p className="text-xs text-gray-500 mt-1">
                            1-2 phrases
                          </p>
                          <p className="text-xs text-gray-400">
                            L'essentiel
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="cursor-pointer">
                      <div className={`border rounded-lg p-3 transition-colors ${
                        config.detailLevel === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="medium" id="medium" className="sr-only" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Moyen</p>
                          <p className="text-xs text-gray-500 mt-1">
                            3-5 phrases
                          </p>
                          <p className="text-xs text-gray-400">
                            Équilibré
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="cursor-pointer">
                      <div className={`border rounded-lg p-3 transition-colors ${
                        config.detailLevel === 'detailed' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="detailed" id="detailed" className="sr-only" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Détaillé</p>
                          <p className="text-xs text-gray-500 mt-1">
                            5+ phrases
                          </p>
                          <p className="text-xs text-gray-400">
                            Complet
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Langue */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Langue du document
                </Label>
                <RadioGroup 
                  value={config.language} 
                  onValueChange={(value: string) => updateConfig('language', value)}
                  className="grid grid-cols-4 gap-2"
                >
                  <label className="cursor-pointer">
                    <div className={`border rounded px-3 py-2 text-center text-sm ${
                      config.language === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="auto" id="auto" className="sr-only" />
                      Auto
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <div className={`border rounded px-3 py-2 text-center text-sm ${
                      config.language === 'fr' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="fr" id="fr" className="sr-only" />
                      🇫🇷 FR
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <div className={`border rounded px-3 py-2 text-center text-sm ${
                      config.language === 'en' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="en" id="en" className="sr-only" />
                      🇬🇧 EN
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <div className={`border rounded px-3 py-2 text-center text-sm ${
                      config.language === 'es' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="es" id="es" className="sr-only" />
                      🇪🇸 ES
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Extraction */}
          <TabsContent value="extraction" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Détection automatique du type */}
              <div className="flex items-start space-x-3">
                <Switch 
                  id="autoDetect" 
                  checked={config.autoDetectType}
                  onCheckedChange={(checked: boolean) => updateConfig('autoDetectType', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="autoDetect" className="font-normal cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Détection automatique du type de document
                    </div>
                  </Label>
                  <p className="text-xs text-gray-500">
                    Identifie automatiquement : factures, CV, contrats, emails...
                  </p>
                </div>
              </div>

              {/* Extraction structurée */}
              <div className="flex items-start space-x-3">
                <Switch 
                  id="structured" 
                  checked={config.includeStructuredData}
                  onCheckedChange={(checked: boolean) => updateConfig('includeStructuredData', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="structured" className="font-normal cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <FileSearch className="w-4 h-4 text-blue-500" />
                      Extraction de données structurées
                    </div>
                  </Label>
                  <p className="text-xs text-gray-500">
                    Extrait automatiquement : montants, dates, noms, adresses...
                  </p>
                </div>
              </div>

              {/* Info sur les types supportés */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Types supportés : Factures, CV, Contrats, Emails, Rapports, Reçus, Cartes de visite
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* Onglet Export */}
          <TabsContent value="export" className="space-y-4 mt-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Formats d'export disponibles après analyse
              </Label>
              <div className="space-y-2">
                {[
                  { id: 'text', label: 'Texte brut (.txt)', icon: FileText },
                  { id: 'json', label: 'JSON structuré (.json)', icon: FileSearch },
                  { id: 'pdf', label: 'PDF avec analyse (.pdf)', icon: FileText },
                  { id: 'excel', label: 'Excel (données structurées)', icon: FileText }
                ].map(format => (
                  <label 
                    key={format.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={config.exportFormat.includes(format.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateConfig('exportFormat', [...config.exportFormat, format.id])
                        } else {
                          updateConfig('exportFormat', config.exportFormat.filter(f => f !== format.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <format.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{format.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Lancer l'analyse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}