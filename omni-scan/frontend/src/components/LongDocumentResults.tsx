import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { FileText, BookOpen, Hash, BarChart3, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface LongDocumentResultsProps {
  result: any
  onCopy: () => void
}

export function LongDocumentResults({ result, onCopy }: LongDocumentResultsProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set())
  
  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedChapters(newExpanded)
  }
  
  const analysis = result.ai_analysis
  const stats = analysis.document_stats
  const structure = analysis.document_structure
  const chapterSummaries = analysis.chapter_summaries || []
  
  return (
    <div className="space-y-6">
      {/* Résumé global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Résumé global du document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {analysis.summary}
          </p>
          
          {/* Points clés */}
          {analysis.key_points && analysis.key_points.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Points clés :</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.key_points.map((point: string, idx: number) => (
                  <li key={idx} className="text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Statistiques du document */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Statistiques du document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.word_count?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Mots</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.paragraph_count || 0}
                </div>
                <div className="text-sm text-gray-600">Paragraphes</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {structure?.chapter_count || 0}
                </div>
                <div className="text-sm text-gray-600">Chapitres</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.avg_sentence_length || 0)}
                </div>
                <div className="text-sm text-gray-600">Mots/phrase</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Structure et thèmes */}
      {structure && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Structure et thèmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Thèmes principaux */}
              {structure.key_themes && structure.key_themes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thèmes identifiés :</h4>
                  <div className="flex flex-wrap gap-2">
                    {structure.key_themes.map((theme: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sujets principaux */}
              {structure.main_topics && structure.main_topics.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sujets principaux :</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {structure.main_topics.slice(0, 5).map((topic: string, idx: number) => (
                      <li key={idx} className="text-gray-600">{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Résumés par chapitre */}
      {chapterSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-orange-600" />
              Résumés par chapitre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chapterSummaries.map((chapter: any, idx: number) => (
                <div 
                  key={idx} 
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleChapter(idx)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      {expandedChapters.has(idx) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900">
                        {chapter.chapter_title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {chapter.word_count} mots
                    </span>
                  </button>
                  
                  {expandedChapters.has(idx) && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-700 mb-3">
                        {chapter.summary}
                      </p>
                      
                      {chapter.key_concepts && chapter.key_concepts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm text-gray-500 mr-2">Concepts clés :</span>
                          {chapter.key_concepts.map((concept: string, cidx: number) => (
                            <span 
                              key={cidx}
                              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onCopy}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Copier le texte complet
        </button>
      </div>
    </div>
  )
}