import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { FileText, Copy, Download, Sparkles } from 'lucide-react'
import { useId, useState } from 'react'
import { AccessibleButton, AccessibleButtonGroup } from './AccessibleButton'
import { AccessibleAlert } from './AccessibleAlert'

interface AccessibleResultsProps {
  result: {
    filename: string
    extracted_text: string
    ai_analysis?: {
      summary?: string
      key_points?: string[]
      document_type?: string
    }
  }
  onCopy: () => void
  onDownload: () => void
  onNewScan: () => void
}

export function AccessibleResults({
  result,
  onCopy,
  onDownload,
  onNewScan
}: AccessibleResultsProps) {
  const resultId = useId()
  const summaryId = useId()
  const textId = useId()
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    await onCopy()
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 3000)
  }

  // Niveau de titre fixé à h2

  return (
    <div 
      id={resultId}
      role="region" 
      aria-label="Résultats de l'analyse OCR"
      className="space-y-6"
    >
      {/* En-tête des résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" aria-hidden="true" />
            <span>Document analysé : {result.filename}</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Résumé IA */}
      {result.ai_analysis?.summary && (
        <Card>
          <CardHeader>
            <h2
              id={summaryId}
              className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              Analyse intelligente
            </h2>
          </CardHeader>
          <CardContent>
            <div 
              role="article"
              aria-labelledby={summaryId}
              className="space-y-4"
            >
              <section>
                <h3 className="font-medium mb-2">Résumé</h3>
                <p className="text-gray-700">{result.ai_analysis.summary}</p>
              </section>

              {result.ai_analysis.key_points && result.ai_analysis.key_points.length > 0 && (
                <section>
                  <h3 className="font-medium mb-2">Points clés</h3>
                  <ul className="list-disc list-inside space-y-1" role="list">
                    {result.ai_analysis.key_points.map((point, index) => (
                      <li key={index} className="text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {result.ai_analysis.document_type && (
                <div 
                  className="inline-flex items-center gap-2 text-sm"
                  role="note"
                >
                  <span className="text-gray-500">Type détecté :</span>
                  <span className="font-medium capitalize">
                    {result.ai_analysis.document_type}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Texte extrait */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2
              id={textId}
              className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              Texte extrait
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Zone de texte avec scroll */}
            <div
              className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="textbox"
              aria-label="Texte extrait du document"
              aria-readonly="true"
              aria-multiline="true"
              aria-describedby={`${textId}-help`}
            >
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {result.extracted_text}
              </pre>
            </div>
            
            <p id={`${textId}-help`} className="text-sm text-gray-500">
              Utilisez les flèches pour naviguer dans le texte. 
              {result.extracted_text.length} caractères extraits.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <AccessibleButtonGroup aria-label="Actions sur les résultats">
          <AccessibleButton
            variant="outline"
            onClick={handleCopy}
            icon={<Copy className="w-4 h-4" />}
            aria-describedby="copy-help"
          >
            Copier le texte
          </AccessibleButton>
          
          <AccessibleButton
            variant="outline"
            onClick={onDownload}
            icon={<Download className="w-4 h-4" />}
            aria-describedby="download-help"
          >
            Télécharger
          </AccessibleButton>
          
          <AccessibleButton
            onClick={onNewScan}
            icon={<Sparkles className="w-4 h-4" />}
            aria-describedby="new-scan-help"
          >
            Nouveau scan
          </AccessibleButton>
        </AccessibleButtonGroup>
      </div>

      {/* Descriptions pour les boutons (cachées visuellement) */}
      <div className="sr-only">
        <span id="copy-help">Copier le texte extrait dans le presse-papiers</span>
        <span id="download-help">Télécharger les résultats au format JSON</span>
        <span id="new-scan-help">Analyser un nouveau document</span>
      </div>

      {/* Notification de copie */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <AccessibleAlert
            type="success"
            message="Texte copié dans le presse-papiers"
            autoClose={3000}
            onClose={() => setCopySuccess(false)}
          />
        </div>
      )}
    </div>
  )
}

// Composant pour la navigation clavier dans les résultats
export function ResultsKeyboardNavigation({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="focus:outline-none"
      tabIndex={-1}
      onKeyDown={(e) => {
        // Raccourcis clavier
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'c':
              // Déclencher la copie
              document.querySelector<HTMLButtonElement>('[aria-describedby="copy-help"]')?.click()
              break
            case 's':
              // Déclencher le téléchargement
              e.preventDefault()
              document.querySelector<HTMLButtonElement>('[aria-describedby="download-help"]')?.click()
              break
            case 'n':
              // Nouveau scan
              e.preventDefault()
              document.querySelector<HTMLButtonElement>('[aria-describedby="new-scan-help"]')?.click()
              break
          }
        }
      }}
    >
      {children}
      
      {/* Instructions clavier */}
      <div 
        className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600"
        role="note"
        aria-label="Raccourcis clavier disponibles"
      >
        <p className="font-medium mb-1">Raccourcis clavier :</p>
        <ul className="space-y-0.5 text-xs">
          <li><kbd className="px-1 py-0.5 bg-white rounded">Ctrl+C</kbd> : Copier le texte</li>
          <li><kbd className="px-1 py-0.5 bg-white rounded">Ctrl+S</kbd> : Télécharger</li>
          <li><kbd className="px-1 py-0.5 bg-white rounded">Ctrl+N</kbd> : Nouveau scan</li>
        </ul>
      </div>
    </div>
  )
}