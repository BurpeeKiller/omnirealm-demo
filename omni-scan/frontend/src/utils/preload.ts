/**
 * Utilitaire de préchargement intelligent des routes
 * Améliore la perception de vitesse en chargeant les routes probables
 */

// Précharge un composant après un délai
export const preloadComponent = (
  componentLoader: () => Promise<any>,
  delay: number = 2000
) => {
  setTimeout(() => {
    componentLoader().catch(() => {
      // Ignorer les erreurs de préchargement
    })
  }, delay)
}

// Précharge quand l'utilisateur survole un lien
export const preloadOnHover = (componentLoader: () => Promise<any>) => {
  let preloaded = false
  
  return {
    onMouseEnter: () => {
      if (!preloaded) {
        preloaded = true
        componentLoader().catch(() => {})
      }
    }
  }
}

// Précharge les routes critiques après le chargement initial
export const preloadCriticalRoutes = () => {
  // Attendre 3 secondes après le chargement initial
  setTimeout(() => {
    // Précharger les routes les plus utilisées
    import('../components/upload').catch(() => {})
    import('../features/home/HomePage').catch(() => {})
  }, 3000)
}

// Hook pour précharger au survol
import { useCallback } from 'react'

export const usePreload = (componentLoader: () => Promise<any>) => {
  const preload = useCallback(() => {
    componentLoader().catch(() => {})
  }, [componentLoader])
  
  return { onMouseEnter: preload }
}