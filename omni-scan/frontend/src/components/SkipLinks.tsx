import { useState } from 'react'

interface SkipLink {
  id: string
  label: string
}

const defaultLinks: SkipLink[] = [
  { id: 'main-content', label: 'Aller au contenu principal' },
  { id: 'upload-zone', label: 'Aller à la zone d\'upload' },
  { id: 'results', label: 'Aller aux résultats' },
  { id: 'navigation', label: 'Aller à la navigation' }
]

interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

export function SkipLinks({ links = defaultLinks, className = '' }: SkipLinksProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  return (
    <div 
      className={`
        fixed top-0 left-0 z-[100] bg-white shadow-lg
        -translate-y-full focus-within:translate-y-0
        transition-transform duration-200
        ${className}
      `}
      role="navigation"
      aria-label="Liens de navigation rapide"
    >
      <ul className="flex flex-wrap gap-2 p-4">
        {links.map((link, index) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={`
                inline-block px-4 py-2 rounded-md text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${focusedIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              onClick={(e) => {
                e.preventDefault()
                const target = document.getElementById(link.id)
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                  target.focus({ preventScroll: true })
                }
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="px-4 pb-2 text-xs text-gray-500">
        Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded">Tab</kbd> pour naviguer
      </div>
    </div>
  )
}

// Hook pour gérer les régions landmark
export function useLandmarks() {
  const setLandmark = (id: string, role: string, label: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.setAttribute('role', role)
      element.setAttribute('aria-label', label)
    }
  }

  const initializeLandmarks = () => {
    // Définir les régions principales
    setLandmark('main-content', 'main', 'Contenu principal')
    setLandmark('upload-zone', 'region', 'Zone d\'upload de documents')
    setLandmark('results', 'region', 'Résultats de l\'analyse')
    setLandmark('navigation', 'navigation', 'Navigation principale')
    
    // Ajouter un titre de page descriptif
    document.title = 'OmniScan - OCR intelligent et accessible'
  }

  return { initializeLandmarks }
}

// Composant pour annoncer les changements d'état
interface LiveRegionProps {
  message: string
  type?: 'polite' | 'assertive'
  clearAfter?: number // ms
}

export function LiveRegion({ 
  message, 
  type = 'polite',
  clearAfter = 5000 
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message)

  // Auto-clear après un délai
  if (clearAfter > 0) {
    setTimeout(() => setCurrentMessage(''), clearAfter)
  }

  return (
    <div
      role="status"
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  )
}

// Indicateur de focus visible
export function FocusIndicator() {
  return (
    <style>{`
      /* Focus visible amélioré */
      *:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      
      /* Désactiver le focus outline par défaut */
      *:focus:not(:focus-visible) {
        outline: none;
      }
      
      /* Focus spécifique pour les éléments interactifs */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
      
      /* Animation du focus */
      @keyframes focusPulse {
        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
        100% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
      }
      
      button:focus-visible {
        animation: focusPulse 1s ease-out;
      }
    `}</style>
  )
}