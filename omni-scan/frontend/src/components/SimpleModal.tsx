import { useEffect, useState } from 'react'

export interface AnalysisConfig {
  detailLevel: string
  language: string
  includeStructuredData: boolean
  chapterSummaries?: boolean
}

interface SimpleModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (config: AnalysisConfig) => void
  fileName: string
}

export function SimpleModal({ isOpen, onClose, onConfirm, fileName }: SimpleModalProps) {
  const [detailLevel, setDetailLevel] = useState('medium')
  const [language, setLanguage] = useState('auto')
  const [includeStructuredData, setIncludeStructuredData] = useState(true)
  const [chapterSummaries, setChapterSummaries] = useState(false)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-4">Configurer l'analyse</h2>
          <p className="text-gray-600 mb-4">Fichier : {fileName}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Niveau de détail</label>
              <select 
                className="w-full border rounded p-2"
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
              >
                <option value="short">Court (1-2 phrases)</option>
                <option value="medium">Moyen (2-3 phrases) - Recommandé</option>
                <option value="detailed">Détaillé (5+ phrases)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {detailLevel === 'short' && "Résumé très concis avec l'essentiel uniquement"}
                {detailLevel === 'medium' && "Résumé équilibré avec les informations principales"}
                {detailLevel === 'detailed' && "Analyse complète avec tous les détails importants"}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Langue du résumé</label>
              <select 
                className="w-full border rounded p-2"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="auto">Même langue que le document</option>
                <option value="fr">Toujours en français</option>
                <option value="en">Toujours en anglais</option>
                <option value="es">Toujours en espagnol</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="structured"
                checked={includeStructuredData}
                onChange={(e) => setIncludeStructuredData(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="structured" className="text-sm">
                Extraire les données structurées (factures, CV, contrats...)
              </label>
            </div>
            
            {/* Option résumés par chapitre pour niveau détaillé */}
            {(detailLevel === 'detailed' || detailLevel === 'high') && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chapters"
                  checked={chapterSummaries}
                  onChange={(e) => setChapterSummaries(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="chapters" className="text-sm">
                  <span className="font-medium">Résumés par chapitre</span>
                  <span className="text-gray-500 ml-1">(pour documents longs)</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => onConfirm({
                detailLevel,
                language,
                includeStructuredData,
                chapterSummaries
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lancer l'analyse
            </button>
          </div>
        </div>
      </div>
    </>
  )
}