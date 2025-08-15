import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { preloadCriticalRoutes } from './utils/preload'

// Import conditionnel pour faciliter le switch entre versions
const USE_OPTIMIZED = true // Mettre à false pour comparer avec l'ancienne version

// Import dynamique basé sur la configuration
const AppComponent = USE_OPTIMIZED 
  ? React.lazy(() => import('./AppOptimized'))
  : React.lazy(() => import('./App'))

// Précharger les routes critiques après le chargement initial
if (USE_OPTIMIZED) {
  preloadCriticalRoutes()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AppComponent />
    </React.Suspense>
  </React.StrictMode>,
)