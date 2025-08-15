import { Progress } from '@/components/ui'
import { Loader2, FileText, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JobStatus } from '@/services/api-simple'

interface UploadProgressProps {
  status: JobStatus
  fileName?: string
  className?: string
  showDetails?: boolean
}

export function UploadProgress({
  status,
  fileName,
  className,
  showDetails = true
}: UploadProgressProps) {
  const { progress, message } = status

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'processing':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const estimatedTime = progress.total > 0 && progress.current > 0
    ? Math.ceil((progress.total - progress.current) * 2)
    : null

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header avec icône et nom de fichier */}
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          {fileName && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
            </div>
          )}
          <p className={cn("text-sm mt-1", getStatusColor())}>
            {progress.message || message || 'Préparation...'}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      {status.status !== 'completed' && status.status !== 'failed' && (
        <>
          <Progress 
            value={progress.percentage} 
            className="h-2"
          />
          
          {showDetails && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {progress.current > 0 && progress.total > 0
                  ? `Étape ${progress.current} sur ${progress.total}`
                  : 'Initialisation...'}
              </span>
              
              {estimatedTime && (
                <span>
                  Temps estimé : {formatTime(estimatedTime)}
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Message pour documents volumineux */}
      {progress.total > 10 && status.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            📄 Document volumineux détecté - le traitement peut prendre plusieurs minutes
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {status.status === 'failed' && status.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{status.error}</p>
        </div>
      )}
    </div>
  )
}