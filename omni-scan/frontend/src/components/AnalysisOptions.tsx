import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Label,
  Switch
} from '@/components/ui'
import { RadioGroup, RadioGroupItem } from './RadioGroup'
import { Settings2, FileText, Zap, FileSearch } from 'lucide-react'

interface AnalysisOptionsProps {
  onOptionsChange: (options: AnalysisOptions) => void
  defaultOptions?: AnalysisOptions
}

export interface AnalysisOptions {
  detailLevel: 'short' | 'medium' | 'detailed'
  includeStructuredData: boolean
  aiProvider: string
}

export function AnalysisOptions({ onOptionsChange, defaultOptions }: AnalysisOptionsProps) {
  const [detailLevel, setDetailLevel] = useState<'short' | 'medium' | 'detailed'>(
    defaultOptions?.detailLevel || 'medium'
  )
  const [includeStructuredData, setIncludeStructuredData] = useState(
    defaultOptions?.includeStructuredData ?? true
  )
  
  const handleDetailChange = (value: string) => {
    const level = value as 'short' | 'medium' | 'detailed'
    setDetailLevel(level)
    onOptionsChange({
      detailLevel: level,
      includeStructuredData,
      aiProvider: defaultOptions?.aiProvider || 'openai'
    })
  }
  
  const handleStructuredDataChange = (checked: boolean) => {
    setIncludeStructuredData(checked)
    onOptionsChange({
      detailLevel,
      includeStructuredData: checked,
      aiProvider: defaultOptions?.aiProvider || 'openai'
    })
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="w-4 h-4" />
          Options d'analyse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveau de détail */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4 text-gray-500" />
            Niveau de détail du résumé
          </div>
          <RadioGroup value={detailLevel} onValueChange={handleDetailChange}>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="short" id="short" />
              <div className="grid gap-0.5">
                <Label htmlFor="short" className="font-normal cursor-pointer">
                  Court
                </Label>
                <p className="text-xs text-gray-500">1-2 phrases, points essentiels uniquement</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <div className="grid gap-0.5">
                <Label htmlFor="medium" className="font-normal cursor-pointer">
                  Moyen
                </Label>
                <p className="text-xs text-gray-500">3-5 phrases, analyse équilibrée</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <div className="grid gap-0.5">
                <Label htmlFor="detailed" className="font-normal cursor-pointer">
                  Détaillé
                </Label>
                <p className="text-xs text-gray-500">Rapport complet avec tous les détails</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Extraction structurée */}
        <div className="flex items-start space-x-3 pt-2 border-t">
          <Switch 
            id="structured" 
            checked={includeStructuredData}
            onCheckedChange={handleStructuredDataChange}
          />
          <div className="grid gap-0.5">
            <Label htmlFor="structured" className="font-normal cursor-pointer flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-gray-500" />
              Extraction de données structurées
            </Label>
            <p className="text-xs text-gray-500">
              Détecte et extrait automatiquement les informations des factures, CV, contrats...
            </p>
          </div>
        </div>
        
        {/* Info sur la rapidité */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <Zap className="w-3 h-3" />
          <span>L'analyse prend généralement 3-5 secondes selon la taille du document</span>
        </div>
      </CardContent>
    </Card>
  )
}