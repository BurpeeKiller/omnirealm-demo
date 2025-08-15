import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import CookieBanner from './components/legal/CookieBanner'
import { UmamiProvider } from './components/UmamiProvider'

// Composants chargés immédiatement (page d'accueil uniquement)
import { LandingPage } from './features/landing/LandingPage'

// Lazy loading pour tous les autres composants
const UploadWithAuth = lazy(() => import('./features/upload/UploadWithAuthNew').then(m => ({ default: m.UploadWithAuth })))
const UploadSimpleWrapper = lazy(() => import('./features/upload/UploadSimpleWrapper'))
const HomePage = lazy(() => import('./features/home/HomePage').then(m => ({ default: m.HomePage })))
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const VerifyMagicLink = lazy(() => import('./features/auth/VerifyMagicLink').then(m => ({ default: m.VerifyMagicLink })))
const PricingPage = lazy(() => import('./features/pricing/PricingPage').then(m => ({ default: m.PricingPage })))
const SuccessPage = lazy(() => import('./pages/SuccessPage').then(m => ({ default: m.SuccessPage })))

// Pages secondaires (lazy loading groupé)
const LegalPages = {
  CGU: lazy(() => import('./pages/legal/CGU').then(m => ({ default: m.CGU }))),
  Privacy: lazy(() => import('./pages/legal/Privacy').then(m => ({ default: m.Privacy }))),
  Legal: lazy(() => import('./pages/legal/Legal').then(m => ({ default: m.Legal }))),
  Cookies: lazy(() => import('./pages/legal/Cookies').then(m => ({ default: m.Cookies })))
}

// Pages legacy/test (très lazy)
const TestPage = lazy(() => import('./pages/TestPage').then(m => ({ default: m.TestPage })))
const UploadPage = lazy(() => import('./features/upload/UploadPageNew').then(m => ({ default: m.UploadPage })))
const SimpleLanding = lazy(() => import('./features/home/SimpleLanding').then(m => ({ default: m.SimpleLanding })))

// Composant de chargement élégant
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )
}

function AppOptimized() {
  return (
    <UmamiProvider 
      websiteId="TODO-REPLACE-WITH-UMAMI-WEBSITE-ID"
      enabled={import.meta.env.PROD}
    >
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Route principale - chargée immédiatement */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Routes principales - lazy loading prioritaire */}
            <Route path="/upload" element={<UploadSimpleWrapper />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify" element={<VerifyMagicLink />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            
            {/* Routes légales - groupées */}
            <Route path="/terms" element={<LegalPages.CGU />} />
            <Route path="/privacy" element={<LegalPages.Privacy />} />
            <Route path="/legal" element={<LegalPages.Legal />} />
            <Route path="/cookies" element={<LegalPages.Cookies />} />
            
            {/* Routes legacy/test - très lazy */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/upload-old" element={<UploadPage />} />
            <Route path="/landing" element={<SimpleLanding />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </div>
    </Router>
    </UmamiProvider>
  )
}

export default AppOptimized