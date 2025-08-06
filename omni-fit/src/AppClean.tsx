import { useEffect, useState } from 'react';
import { Clock } from '@/components/Clock';
import { ReminderTimer } from '@/components/ReminderTimer';
import { ExerciseCard } from '@/components/ExerciseCard';
import { DailyStats } from '@/components/Stats/DailyStats';
import { Settings } from '@/components/Settings';
import { Stats } from '@/components/Stats';
import StreakDisplay from '@/components/StreakDisplay';
import { BackupNotification } from '@/components/BackupNotification';
import { OnboardingTrigger } from '@/components/Onboarding/OnboardingTrigger';
import { ContextualTips } from '@/components/Onboarding/ContextualTips';
import { AICoachModal } from '@/components/AICoach';
import { NetworkStatus } from '@/components/NetworkStatus';
import { useExercisesStore } from '@/stores/exercises.store';
import { useReminderStore } from '@/stores/reminder.store';
import { analytics } from '@/services/analytics';
import { backupService } from '@/services/backup';
import { registerServiceWorker, setupNetworkHandlers } from '@/services/pwa';
import { Settings as SettingsIcon, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function AppClean() {
  const { exercises, loadTodayStats } = useExercisesStore();
  const { startTimer } = useReminderStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);

  useEffect(() => {
    // Enregistrer le Service Worker pour le mode offline
    registerServiceWorker();
    
    // Configurer les gestionnaires réseau
    setupNetworkHandlers();

    // Load today's stats
    loadTodayStats();

    // Start reminder timer
    startTimer();

    // Track session start
    analytics.trackSessionStart();

    // Start auto-backup system
    backupService.startAutoBackup();

    // Cleanup
    return () => {
      useReminderStore.getState().stopTimer();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Network Status */}
      <NetworkStatus />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <Clock />
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <ReminderTimer />

        {/* Streak Display */}
        <div className="px-4 mb-6">
          <StreakDisplay />
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-6">
          {exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.type} exercise={exercise} index={index} />
          ))}
        </div>

        {/* Daily Stats */}
        <DailyStats />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-primary-400 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAICoach(true)}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">Coach AI</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-primary-400 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-xs">Réglages</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400 hover:text-primary-400 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </motion.button>
        </div>
      </nav>

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Stats Modal */}
      <Stats isOpen={showStats} onClose={() => setShowStats(false)} />

      {/* AI Coach Modal */}
      <AICoachModal isOpen={showAICoach} onClose={() => setShowAICoach(false)} />

      {/* Backup Notification */}
      <BackupNotification />

      {/* Onboarding progressif */}
      <OnboardingTrigger />

      {/* Tips contextuels */}
      <ContextualTips />
    </div>
  );
}

export default AppClean;
