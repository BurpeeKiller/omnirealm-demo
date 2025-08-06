import { motion } from 'framer-motion';
import { useExercisesStore } from '@/stores/exercises.store';
import { useSettingsStore } from '@/stores/settings.store';
import { Target, TrendingUp } from 'lucide-react';

export const DailyStats = () => {
  const { todayTotal } = useExercisesStore();
  const { dailyGoal } = useSettingsStore();

  const progress = Math.min((todayTotal / dailyGoal) * 100, 100);

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 mx-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          Aujourd'hui
        </h3>
        <div className="text-3xl font-bold text-gradient">{todayTotal}</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Objectif
          </span>
          <span className="text-gray-300 font-medium">{dailyGoal}</span>
        </div>

        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="text-center text-sm text-gray-400">
          {progress >= 100 ? (
            <span className="text-green-400 font-medium">✨ Objectif atteint! Bravo!</span>
          ) : (
            <span>Encore {dailyGoal - todayTotal} pour atteindre l'objectif</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
