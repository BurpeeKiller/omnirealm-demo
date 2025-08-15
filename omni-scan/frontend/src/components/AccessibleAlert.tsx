import { Alert, AlertDescription, AlertTitle } from '@/components/ui'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { useEffect, useId } from 'react'

type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AccessibleAlertProps {
  type?: AlertType
  title?: string
  message: string
  onClose?: () => void
  autoClose?: number // ms avant fermeture auto
  actions?: React.ReactNode
  className?: string
}

const alertConfig = {
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-600',
    role: 'status',
    ariaLive: 'polite' as const
  },
  success: {
    icon: CheckCircle2,
    className: 'bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    role: 'status',
    ariaLive: 'polite' as const
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-50 border-yellow-200',
    iconClass: 'text-yellow-600',
    role: 'alert',
    ariaLive: 'polite' as const
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200',
    iconClass: 'text-red-600',
    role: 'alert',
    ariaLive: 'assertive' as const
  }
}

export function AccessibleAlert({
  type = 'info',
  title,
  message,
  onClose,
  autoClose,
  actions,
  className = ''
}: AccessibleAlertProps) {
  const alertId = useId()
  const titleId = useId()
  const descId = useId()
  
  const config = alertConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  return (
    <Alert
      id={alertId}
      className={`${config.className} ${className}`}
      role={config.role}
      aria-live={config.ariaLive}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descId}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0`} aria-hidden="true" />
        
        <div className="flex-1">
          {title && (
            <AlertTitle id={titleId} className="mb-1">
              {title}
            </AlertTitle>
          )}
          <AlertDescription id={descId}>
            {message}
          </AlertDescription>
          
          {actions && (
            <div className="mt-3" role="group" aria-label="Actions disponibles">
              {actions}
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="
              p-1 rounded-md hover:bg-black/5 transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            "
            aria-label="Fermer l'alerte"
          >
            <XCircle className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {autoClose && (
        <div
          className="mt-2 h-0.5 bg-current opacity-20 animate-shrink"
          style={{
            animationDuration: `${autoClose}ms`
          }}
          aria-hidden="true"
        />
      )}
    </Alert>
  )
}

// Hook pour gérer une pile d'alertes
export function useAccessibleAlerts() {
  const announce = (message: string, type: AlertType = 'info') => {
    // Créer un élément temporaire pour les lecteurs d'écran
    const announcement = document.createElement('div')
    announcement.setAttribute('role', type === 'error' ? 'alert' : 'status')
    announcement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Retirer après 1 seconde
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return { announce }
}

// Style pour l'animation de fermeture automatique
const styles = `
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-shrink {
  animation: shrink linear forwards;
}
`

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}