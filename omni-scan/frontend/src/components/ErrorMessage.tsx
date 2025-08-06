import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react'

interface ErrorMessageProps {
  error: any
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  // Analyser l'erreur et fournir un message user-friendly
  const getErrorDetails = () => {
    const status = error?.response?.status || error?.status
    
    switch (status) {
      case 500:
        return {
          title: "Oops ! Notre serveur a un petit souci",
          message: "Pas de panique, cela arrive parfois. Réessayez dans quelques secondes.",
          action: "Vérifiez que le fichier est bien une image ou un PDF.",
          icon: AlertCircle
        }
      case 413:
        return {
          title: "Fichier trop volumineux",
          message: "Votre fichier dépasse la limite de 50MB.",
          action: "Essayez de compresser votre fichier ou de le diviser en plusieurs parties.",
          icon: AlertCircle
        }
      case 429:
        return {
          title: "Trop de demandes",
          message: "Vous avez atteint la limite de scans pour le moment.",
          action: "Attendez quelques minutes ou passez au plan Pro pour des scans illimités.",
          icon: AlertCircle
        }
      case 401:
        return {
          title: "Connexion requise",
          message: "Cette fonctionnalité nécessite d'être connecté.",
          action: "Connectez-vous pour accéder à toutes les fonctionnalités.",
          icon: HelpCircle
        }
      default:
        return {
          title: "Une erreur est survenue",
          message: error?.message || "Quelque chose s'est mal passé.",
          action: "Si le problème persiste, contactez notre support.",
          icon: AlertCircle
        }
    }
  }
  
  const { title, message, action, icon: Icon } = getErrorDetails()
  
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-start">
        <Icon className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
            {action && (
              <p className="mt-1 font-medium">{action}</p>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}