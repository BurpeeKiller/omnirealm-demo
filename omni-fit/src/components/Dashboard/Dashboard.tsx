import { Header } from '@/components/Header';
import { DailyProgress } from '@/components/Progress/DailyProgress';
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
const ProgramsModal = lazy(() => import('@/components/Programs/ProgramsModal').then(module => ({ default: module.ProgramsModal })));
import { useExercisesStore } from '@/stores/exercises.store';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Settings as SettingsIcon, BarChart3, Shield, Crown, LogOut, Sparkles, Lock, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { AchievementToast, LevelProgress } from '@/components/Gamification';

interface DashboardProps {
  onLogout?: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const { exerciseDefinitions } = useExercisesStore();
  const { isPremium, isInTrial } = useSubscription();
  const { isPremium: isPremiumAuth } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Limite d'exercices pour les utilisateurs gratuits
  const FREE_EXERCISE_LIMIT = 3;
  const isReallyPremium = isPremium || isPremiumAuth;

  // Message de bienvenue selon le statut
  const getWelcomeMessage = () => {
    if (isPremium) return "Mode Premium Actif";
    if (isInTrial) return "Période d'essai Active";
    return "Version Gratuite";
  };

  // Écouter l'événement pour afficher l'écran d'upgrade
  useEffect(() => {
    const handleUpgradePrompt = (event: CustomEvent) => {
      setShowUpgradePrompt(true);
    };
    
    window.addEventListener('show-upgrade-prompt', handleUpgradePrompt as EventListener);
    return () => {
      window.removeEventListener('show-upgrade-prompt', handleUpgradePrompt as EventListener);
    };
  }, []);

  // Gérer la visibilité de la navigation au scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si une modal est ouverte, garder la nav visible
      const isAnyModalOpen = showSettings || showStats || showSecurityModal || 
                           showUpgradePrompt || showAICoach || showPrograms;
      
      if (isAnyModalOpen) {
        setIsNavVisible(true);
        return;
      }
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSettings, showStats, showSecurityModal, showUpgradePrompt, showAICoach, showPrograms]);

  // Bloquer le scroll du body quand une modal est ouverte
  useEffect(() => {
    const isAnyModalOpen = showSettings || showStats || showSecurityModal || 
                         showUpgradePrompt || showAICoach || showPrograms;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSettings, showStats, showSecurityModal, showUpgradePrompt, showAICoach, showPrograms]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header avec statut */}
      <header 
        className={`sticky top-0 z-50 bg-gray-900 border-b border-gray-800 transition-transform duration-300 ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
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

        {/* Level Progress - Gamification */}
        <div className="px-4 mb-6">
          <LevelProgress />
        </div>

        {/* Daily Progress */}
        <div className="px-4 mb-6">
          <DailyProgress />
        </div>

        {/* Info limitation gratuite */}
        {!isReallyPremium && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg"
          >
            <p className="text-sm text-yellow-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Version gratuite : {FREE_EXERCISE_LIMIT} exercices disponibles. 
              <button
                onClick={() => setShowUpgradePrompt(true)}
                className="underline hover:text-yellow-200 transition-colors"
              >
                Passer à Premium
              </button>
            </p>
          </motion.div>
        )}

        {/* Exercise Cards */}
        <section 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-6"
          role="region"
          aria-label="Exercices disponibles"
        >
          {exerciseDefinitions.map((exercise, index) => {
            const isLocked = !isReallyPremium && index >= FREE_EXERCISE_LIMIT;
            
            if (isLocked) {
              return (
                <motion.div
                  key={exercise.type}
                  className="relative bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 opacity-60"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center bg-opacity-95">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 font-medium">Premium</p>
                    </div>
                  </div>
                  <div className="opacity-50 pointer-events-none">
                    <ExerciseCard exercise={exercise} index={index} />
                  </div>
                  <button
                    onClick={() => setShowUpgradePrompt(true)}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    aria-label={`Débloquer ${exercise.name} avec Premium`}
                  />
                </motion.div>
              );
            }
            
            return <ExerciseCard key={exercise.type} exercise={exercise} index={index} />;
          })}
        </section>

        {/* Daily Stats */}
        <DailyStats />

        {/* Premium CTA si gratuit */}
        {!isPremium && !isInTrial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg"
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
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 safe-bottom transition-transform duration-300 ${
          isNavVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
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
              <Sparkles className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
              <span className="text-sm lg:text-base">Coach AI</span>
            </motion.button>
          )}
          
          {/* Programmes - Disponible pour tous */}
          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPrograms(true)}
            aria-label="Ouvrir les programmes"
          >
            <Dumbbell className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-sm lg:text-base">Programmes</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSecurityModal(true)}
          >
            <Shield className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-sm lg:text-base">Sécurité</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-sm lg:text-base">Réglages</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-purple-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-sm lg:text-base">Stats</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-yellow-400 transition-all duration-200 group"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpgradePrompt(true)}
          >
            <Crown className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-sm lg:text-base">Premium</span>
          </motion.button>

          {onLogout && (
            <motion.button
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-red-400 transition-all duration-200 group"
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
            >
              <LogOut className="w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
              <span className="text-sm lg:text-base">Quitter</span>
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
      <Suspense fallback={null}>
        <ProgramsModal isOpen={showPrograms} onClose={() => setShowPrograms(false)} />
      </Suspense>
      
      {/* Achievement Notifications */}
      <AchievementToast />
      
    </div>
  );
};