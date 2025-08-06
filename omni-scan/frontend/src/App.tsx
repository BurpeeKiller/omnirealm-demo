// import { ToastProvider } from '@omnirealm/ui'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import { AuthProvider } from './features/auth/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { HomePage } from './features/home/HomePage'
import { SimpleLanding } from './features/home/SimpleLanding'
import { UploadPage } from './features/upload/UploadPage'
import { UploadSimple } from './features/upload/UploadSimple'
import { UploadWithAuth } from './features/upload/UploadWithAuth'
import { VerifyMagicLink } from './features/auth/VerifyMagicLink'
import { PricingPage } from './features/pricing/PricingPage'
import { LandingPage } from './features/landing/LandingPage'
import { TestPage } from './pages/TestPage'
import { CGU } from './pages/legal/CGU'
import { Privacy } from './pages/legal/Privacy'
import { Legal } from './pages/legal/Legal'
import { Cookies } from './pages/legal/Cookies'
// import { Footer } from './components/Footer'
// import { CookieBanner } from './components/CookieBanner'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/upload" element={<UploadWithAuth />} />
              <Route path="/simple" element={<UploadSimple />} />
              <Route path="/upload-old" element={<UploadPage />} />
              <Route path="/landing" element={<SimpleLanding />} />
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/verify" element={<VerifyMagicLink />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/terms" element={<CGU />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/cookies" element={<Cookies />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App