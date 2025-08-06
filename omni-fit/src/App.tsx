import { useEffect } from 'react';
import { ComplianceProvider } from '@omnirealm/compliance';
import { LandingPage } from '@/components/Landing/LandingPage';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { OnboardingFlow } from '@/components/Onboarding';
import { useAppState } from '@/hooks/useAppState';
import { useExercisesStore } from '@/stores/exercises.store';
import { useReminderStore } from '@/stores/reminder.store';
import { useNotification } from '@/hooks/useNotification';
import { analytics } from '@/services/analytics';
import { backupService } from '@/services/backup';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { currentView, startApp, completeOnboarding, resetApp } = useAppState();
  const { loadTodayStats } = useExercisesStore();
  const { startTimer } = useReminderStore();
  const { requestPermission } = useNotification();

  useEffect(() => {
    let mounted = true;
    
    // Initialiser les services uniquement sur le dashboard
    if (currentView === 'dashboard' && mounted) {
      // Délai pour éviter le double déclenchement
      const timer = setTimeout(() => {
        if (!mounted) return;
        
        loadTodayStats();
        startTimer();
        requestPermission();
        analytics.trackSessionStart();
        backupService.startAutoBackup();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        useReminderStore.getState().stopTimer();
        mounted = false;
      };
    }
  }, [currentView]);

  const complianceConfig = {
    consent: {
      purposes: ['necessary', 'analytics', 'personalization'] as ('necessary' | 'analytics' | 'personalization')[],
      privacyPolicyUrl: '/privacy',
      cookiePolicyUrl: '/cookies',
      language: 'fr' as const,
      position: 'bottom' as const,
      theme: 'dark' as const
    },
    ai: {
      features: [{
        id: 'ai-coach',
        name: 'Coach IA Personnel',
        description: 'Assistant IA pour conseils fitness personnalisés utilisant GPT-3.5 Turbo',
        capabilities: ['recommendation', 'generation', 'analysis'] as const,
        riskLevel: 'limited' as const,
        transparency: 'Utilise votre clé API OpenAI personnelle. Aucune donnée stockée sur nos serveurs.',
        humanOversight: true,
        optOut: true
      }],
      defaultOptIn: false,
      showConfidenceScores: true,
      requireExplicitConsent: true
    },
    storage: 'localStorage' as const
  };

  return (
    <ComplianceProvider config={complianceConfig}>
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage 
              onStartFree={() => startApp(false)}
              onLogin={() => startApp(false)}
            />
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
            <OnboardingFlow onComplete={completeOnboarding} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard onLogout={resetApp} />
          </motion.div>
        )}
      </AnimatePresence>
    </ComplianceProvider>
  );
}

export default App;