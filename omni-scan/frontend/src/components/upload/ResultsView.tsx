import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui'
import { FileText, CheckCircle2, Sparkles, Copy, Download, Upload, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AnalysisResult {
  filename: string
  text_length: number
  processing_time: string
  extracted_text: string
  ai_analysis?: {
    summary?: string
    key_points?: string[]
    structured_data?: any
    chapters?: Array<{
      title: string
      summary: string
    }>
  }
  metadata?: {
    pages?: number
    language?: string
    confidence?: number
  }
}

interface ResultsViewProps {
  result: AnalysisResult
  onCopy?: () => void
  onDownload?: () => void
  onNewScan?: () => void
  showRawText?: boolean
  showAIAnalysis?: boolean
  className?: string
  variant?: 'full' | 'compact'
}

export function ResultsView({
  result,
  onCopy,
  onDownload,
  onNewScan,
  showRawText = true,
  showAIAnalysis = true,
  className,
  variant = 'full'
}: ResultsViewProps) {
  const [showFullText, setShowFullText] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result.extracted_text)
    onCopy?.()
  }

  const handleDownload = () => {
    const blob = new Blob([result.extracted_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-${result.filename}.txt`
    a.click()
    URL.revokeObjectURL(url)
    onDownload?.()
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">{result.filename}</p>
                  <p className="text-xs text-gray-500">
                    {result.text_length} caractères • {result.processing_time}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Succès
              </Badge>
            </div>
            
            {result.ai_analysis?.summary && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {result.ai_analysis.summary}
              </p>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="w-3 h-3 mr-1" />
                Copier
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="w-3 h-3 mr-1" />
                Télécharger
              </Button>
              {onNewScan && (
                <Button size="sm" onClick={onNewScan}>
                  <Upload className="w-3 h-3 mr-1" />
                  Nouveau
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Caractères :</span>
              <span className="ml-2 font-medium">{result.text_length.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Temps :</span>
              <span className="ml-2 font-medium">{result.processing_time}</span>
            </div>
            {result.metadata?.pages && (
              <div>
                <span className="text-gray-500">Pages :</span>
                <span className="ml-2 font-medium">{result.metadata.pages}</span>
              </div>
            )}
            {result.metadata?.language && (
              <div>
                <span className="text-gray-500">Langue :</span>
                <span className="ml-2 font-medium">{result.metadata.language}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Texte extrait */}
      {showRawText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Texte extrait</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFullText(!showFullText)}
                >
                  {showFullText ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Réduire
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Tout afficher
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className={cn(
                "whitespace-pre-wrap text-sm font-mono",
                !showFullText && "line-clamp-6"
              )}>
                {result.extracted_text}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyse IA */}
      {showAIAnalysis && result.ai_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Analyse IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.ai_analysis.summary && (
                <div>
                  <h4 className="font-medium mb-2">Résumé</h4>
                  <p className="text-gray-600">{result.ai_analysis.summary}</p>
                </div>
              )}
              
              {result.ai_analysis.key_points && result.ai_analysis.key_points.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Points clés</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.ai_analysis.key_points.map((point: string, i: number) => (
                      <li key={i} className="text-gray-600">{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ai_analysis.chapters && result.ai_analysis.chapters.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Chapitres détectés</h4>
                  <div className="space-y-2">
                    {result.ai_analysis.chapters.map((chapter, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-medium text-sm">{chapter.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{chapter.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nouveau scan */}
      {onNewScan && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={onNewScan}
          >
            <Upload className="w-4 h-4 mr-2" />
            Scanner un autre document
          </Button>
        </div>
      )}
    </div>
  )
}