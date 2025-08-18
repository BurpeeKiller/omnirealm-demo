import { useEffect, lazy, Suspense } from 'react';

// Lazy load des composants lourds
const LandingPage = lazy(() => import('@/components/Landing/LandingPage').then(module => ({ default: module.LandingPage })));
const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const OnboardingFlow = lazy(() => import('@/components/Onboarding').then(module => ({ default: module.OnboardingFlow })));
const Privacy = lazy(() => import('@/pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('@/pages/Terms').then(module => ({ default: module.Terms })));
const CGV = lazy(() => import('@/pages/CGV').then(module => ({ default: module.CGV })));
const Pricing = lazy(() => import('@/pages/Pricing').then(module => ({ default: module.Pricing })));
const AuthCallback = lazy(() => import('@/pages/auth/callback').then(module => ({ default: module.AuthCallback })));
import CookieBanner from '@/components/legal/CookieBanner';
import { UmamiProvider } from '@/components/UmamiProvider';
import { ErrorNotification } from '@/components/ErrorNotification';
import { useAppState } from '@/hooks/useAppState';
import { useExercisesStore } from '@/stores/exercises.store';
import { useReminderTimer } from '@/hooks/useReminderTimer';
import { useNotification } from '@/hooks/useNotification';
import { analytics } from '@/services/analytics';
import { backupService } from '@/services/backup';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/components/LoadingSpinner';

function App() {
  const { currentView, startApp, completeOnboarding, resetApp } = useAppState();
  const { loadTodayStats } = useExercisesStore();
  const { requestPermission } = useNotification();

  // Simple routing for legal and auth pages
  const path = window.location.pathname;
  const isLegalPage = ['/privacy', '/terms', '/cgv'].includes(path);
  const isPricingPage = path === '/pricing';
  const isAuthPage = path.startsWith('/auth/');

  // Gérer le timer de rappel avec cleanup approprié
  useReminderTimer(currentView === 'dashboard' && !isLegalPage && !isPricingPage);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout | undefined;
    
    // Initialiser les services uniquement sur le dashboard
    if (currentView === 'dashboard' && mounted && !isLegalPage && !isPricingPage) {
      // Délai pour éviter le double déclenchement
      timer = setTimeout(() => {
        if (!mounted) return;
        
        loadTodayStats();
        requestPermission();
        analytics.trackSessionStart();
        backupService.startAutoBackup();
      }, 100);
    }
    
    return () => {
      mounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentView, loadTodayStats, requestPermission, isLegalPage, isPricingPage]);

  return (
    <UmamiProvider 
      websiteId={import.meta.env.VITE_UMAMI_WEBSITE_ID || '3397bfec-f292-4173-bad6-f60a588a022c'}
      enabled={import.meta.env.PROD && !!import.meta.env.VITE_UMAMI_WEBSITE_ID}
    >
      {/* Legal pages routing */}
      {isLegalPage && (
        <Suspense fallback={<LoadingSpinner />}>
          {path === '/privacy' && <Privacy />}
          {path === '/terms' && <Terms />}
          {path === '/cgv' && <CGV />}
        </Suspense>
      )}
      
      {/* Pricing page */}
      {isPricingPage && (
        <Suspense fallback={<LoadingSpinner />}>
          <Pricing />
        </Suspense>
      )}
      
      {/* Auth pages routing */}
      {isAuthPage && (
        <Suspense fallback={<LoadingSpinner />}>
          {path === '/auth/callback' && <AuthCallback />}
        </Suspense>
      )}

      {/* Main app */}
      {!isLegalPage && !isPricingPage && !isAuthPage && (
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <LandingPage 
                  onStartFree={() => startApp(false)}
                  onLogin={() => startApp(false)}
                />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <OnboardingFlow onComplete={completeOnboarding} />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard onLogout={resetApp} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      <CookieBanner />
      <ErrorNotification />
    </UmamiProvider>
  );
}

export default App;