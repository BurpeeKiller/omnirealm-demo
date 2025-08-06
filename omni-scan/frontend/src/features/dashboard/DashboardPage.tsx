import { FileText, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/services/supabase'

export function DashboardPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user, loadDocuments])

  const loadDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      console.error('Erreur chargement documents:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mes documents</h1>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun document pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{doc.filename}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                    <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  
                  {doc.ai_analysis?.summary && (
                    <p className="mt-3 text-gray-700">{doc.ai_analysis.summary}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  <span className="text-sm text-gray-600">
                    {doc.status === 'completed' ? 'Terminé' :
                     doc.status === 'processing' ? 'En cours' : 'Erreur'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}