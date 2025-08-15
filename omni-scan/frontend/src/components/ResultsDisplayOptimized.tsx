import { memo, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Download,
  Calendar,
  Euro,
  User,
  Mail,
  Hash,
  Globe,
  TrendingUp
} from 'lucide-react'
import { DocumentTypeBadge } from './DocumentTypeBadge'
import { StructuredDataDisplay } from './StructuredDataDisplay'
import { LongDocumentResults } from './LongDocumentResults'

interface ResultsDisplayProps {
  result: any
  onCopy: () => void
  onDownload: () => void
  onNewScan: () => void
}

// Composant mémorisé pour éviter les re-renders inutiles
export const ResultsDisplayOptimized = memo(function ResultsDisplay({ 
  result, 
  onCopy, 
  onDownload, 
  onNewScan 
}: ResultsDisplayProps) {
  
  // Mémoriser les calculs coûteux
  const isLongDocument = useMemo(() => 
    result.ai_analysis?.is_long_document === true,
    [result.ai_analysis?.is_long_document]
  )
  
  // Mémoriser la fonction getIcon
  const getIcon = useMemo(() => {
    const iconMap: Record<string, any> = {
      'invoice': Euro,
      'cv': User,
      'email': Mail,
      'contract': FileText,
    }
    return (type: string) => iconMap[type] || FileText
  }, [])
  
  // Extraire et mémoriser les infos clés
  const keyInfo = useMemo(() => {
    if (!result.ai_analysis?.structured_data?.data) return []
    
    const data = result.ai_analysis.structured_data.data
    const type = result.ai_analysis.document_type
    
    switch (type) {
      case 'invoice':
        return [
          { icon: Euro, label: 'Montant TTC', value: data.total_amount ? `${data.total_amount}€` : '-' },
          { icon: Calendar, label: 'Date', value: data.date || '-' },
          { icon: Hash, label: 'N° Facture', value: data.invoice_number || '-' }
        ]
      case 'cv':
        return [
          { icon: User, label: 'Nom', value: data.name || '-' },
          { icon: TrendingUp, label: 'Expérience', value: data.experience_years ? `${data.experience_years} ans` : '-' },
          { icon: Globe, label: 'Poste', value: data.current_position || '-' }
        ]
      case 'email':
        return [
          { icon: Mail, label: 'De', value: data.from || '-' },
          { icon: Calendar, label: 'Date', value: data.date || '-' },
          { icon: CheckCircle2, label: 'Actions', value: data.action_required ? 'Oui' : 'Non' }
        ]
      default:
        return []
    }
  }, [result.ai_analysis?.structured_data?.data, result.ai_analysis?.document_type])
  
  const Icon = getIcon(result.ai_analysis?.document_type || 'general')
  
  // Si c'est un document long, utiliser le composant spécialisé
  if (isLongDocument) {
    return <LongDocumentResultsMemo result={result} onCopy={onCopy} onDownload={onDownload} onNewScan={onNewScan} />
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header avec infos du document */}
      <ResultsHeaderMemo 
        filename={result.filename}
        documentType={result.ai_analysis?.document_type}
        documentConfidence={result.ai_analysis?.document_confidence}
        textLength={result.text_length}
        processingTime={result.processing_time}
        Icon={Icon}
      />
      
      {/* Infos clés extraites */}
      {keyInfo.length > 0 && <KeyInfoGridMemo keyInfo={keyInfo} />}
      
      {/* Résumé et analyse */}
      <ResultsAnalysisMemo 
        summary={result.ai_analysis?.summary}
        keyPoints={result.ai_analysis?.key_points}
        extractedText={result.extracted_text}
      />
      
      {/* Données structurées */}
      {result.ai_analysis?.structured_data && (
        <StructuredDataDisplay data={result.ai_analysis.structured_data} />
      )}
      
      {/* Actions */}
      <ResultsActionsMemo 
        onCopy={onCopy}
        onDownload={onDownload}
        onNewScan={onNewScan}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour éviter les re-renders
  return prevProps.result?.filename === nextProps.result?.filename &&
         prevProps.result?.ai_analysis?.summary === nextProps.result?.ai_analysis?.summary
})

// Sous-composants mémorisés
const ResultsHeaderMemo = memo(function ResultsHeader(props: any) {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <props.Icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {props.filename}
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Analysé
                </Badge>
              </CardTitle>
              {props.documentType && (
                <div className="mt-1">
                  <DocumentTypeBadge 
                    type={props.documentType}
                    confidence={props.documentConfidence}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>{props.textLength} caractères</p>
            <p>{props.processingTime}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
})

const KeyInfoGridMemo = memo(function KeyInfoGrid({ keyInfo }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {keyInfo.map((info: any, i: number) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <info.icon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{info.label}</p>
                <p className="font-semibold">{info.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

const ResultsAnalysisMemo = memo(function ResultsAnalysis(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Analyse IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {props.summary && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Résumé</h4>
            <p className="text-gray-700">{props.summary}</p>
          </div>
        )}
        
        {props.keyPoints && props.keyPoints.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Points clés</h4>
            <ul className="list-disc list-inside space-y-1">
              {props.keyPoints.map((point: string, i: number) => (
                <li key={i} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Texte extrait</h4>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {props.extractedText}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

const ResultsActionsMemo = memo(function ResultsActions(props: any) {
  return (
    <div className="flex justify-center gap-4">
      <Button onClick={props.onCopy} variant="outline">
        <Copy className="w-4 h-4 mr-2" />
        Copier le texte
      </Button>
      <Button onClick={props.onDownload} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Télécharger
      </Button>
      <Button onClick={props.onNewScan}>
        <Sparkles className="w-4 h-4 mr-2" />
        Nouveau scan
      </Button>
    </div>
  )
})

// Version mémorisée de LongDocumentResults
const LongDocumentResultsMemo = memo(function LongDocumentResultsWrapper(props: any) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <ResultsHeaderMemo 
        filename={props.result.filename}
        documentType={props.result.ai_analysis?.document_type}
        documentConfidence={props.result.ai_analysis?.document_confidence}
        textLength={props.result.text_length}
        processingTime={props.result.processing_time}
        Icon={FileText}
      />
      <LongDocumentResults result={props.result} onCopy={props.onCopy} />
      <ResultsActionsMemo 
        onCopy={props.onCopy}
        onDownload={props.onDownload}
        onNewScan={props.onNewScan}
      />
    </div>
  )
})