import { Header } from '@/components/Header';
import { ReminderTimer } from '@/components/ReminderTimer';
import { ExerciseCard } from '@/components/ExerciseCard';
import { DailyStats } from '@/components/Stats/DailyStats';
import { lazy, Suspense } from 'react';
import StreakDisplay from '@/components/StreakDisplay';
import { BackupNotification } from '@/components/BackupNotification';
import { PremiumBadge } from '@/components/Premium';

// Lazy load des modals lourds
const Settings = lazy(() => import('@/components/Settings').then(module => ({ default: module.Settings })));
const Stats = lazy(() => import('@/components/Stats').then(module => ({ default: module.Stats })));
const SecurityModal = lazy(() => import('@/components/SecurityModal').then(module => ({ default: module.SecurityModal })));
const UpgradePrompt = lazy(() => import('@/components/Premium').then(module => ({ default: module.UpgradePrompt })));
const AICoachModal = lazy(() => import('@/components/AICoach').then(module => ({ default: module.AICoachModal })));
import { useExercisesStore } from '@/stores/exercises.store';
import { useSubscription } from '@/hooks/useSubscription';
import { Settings as SettingsIcon, BarChart3, Shield, Crown, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DebugSubscription } from '@/components/DebugSubscription';

interface DashboardProps {
  onLogout?: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const { exerciseDefinitions } = useExercisesStore();
  const { isPremium, isInTrial } = useSubscription();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);

  // Message de bienvenue selon le statut
  const getWelcomeMessage = () => {
    if (isPremium) return "Mode Premium Actif";
    if (isInTrial) return "Période d'essai Active";
    return "Version Gratuite";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header avec statut */}
      <header 
        className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800"
        role="banner"
        aria-label="En-tête principal"
      >
        <Header />
        {/* Bandeau de statut */}
        <div 
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-4 py-2"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">
              {getWelcomeMessage()}
            </p>
            {(isPremium || isInTrial) && <PremiumBadge size="small" />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20" role="main" aria-label="Contenu principal">
        <ReminderTimer />

        {/* Streak Display */}
        <div className="px-4 mb-6">
          <StreakDisplay />
        </div>

        {/* Exercise Cards */}
        <section 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-6"
          role="region"
          aria-label="Exercices disponibles"
        >
          {exerciseDefinitions.map((exercise, index) => (
            <ExerciseCard key={exercise.type} exercise={exercise} index={index} />
          ))}
        </section>

        {/* Daily Stats */}
        <DailyStats />

        {/* Premium CTA si gratuit */}
        {!isPremium && !isInTrial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Débloquez votre potentiel
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Accédez au coach IA et aux programmes personnalisés
            </p>
            <button
              onClick={() => setShowUpgradePrompt(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              aria-label="Ouvrir la fenêtre de mise à niveau Premium"
            >
              Découvrir Premium
            </button>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="flex justify-around py-3">
          {/* Coach AI - Premium ou Trial uniquement */}
          {(isPremium || isInTrial) && (
            <motion.button
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAICoach(true)}
              aria-label="Ouvrir le coach IA"
            >
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Coach AI</span>
            </motion.button>
          )}

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSecurityModal(true)}
          >
            <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Sécurité</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Réglages</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Stats</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-yellow-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpgradePrompt(true)}
          >
            <Crown className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Premium</span>
          </motion.button>

          {onLogout && (
            <motion.button
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-red-400 transition-all duration-200 group"
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
            >
              <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Quitter</span>
            </motion.button>
          )}
        </div>
      </nav>

      {/* Modals */}
      <Suspense fallback={null}>
        <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <Stats isOpen={showStats} onClose={() => setShowStats(false)} />
      </Suspense>
      <BackupNotification />
      <Suspense fallback={null}>
        <SecurityModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <AICoachModal isOpen={showAICoach} onClose={() => setShowAICoach(false)} />
      </Suspense>
      
      {/* Debug temporaire */}
      <DebugSubscription />
    </div>
  );
};