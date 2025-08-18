import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { useExercisesStore } from '@/stores/exercises.store';
import { useSettingsStore } from '@/stores/settings.store';

export const DailyProgress = () => {
  const { todayTotal } = useExercisesStore();
  const { dailyGoal } = useSettingsStore();
  
  const progress = Math.min((todayTotal / dailyGoal) * 100, 100);
  const isCompleted = progress >= 100;
  
  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-600 border border-transparent cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
            {isCompleted ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <Target className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">Objectif journalier</h3>
            <p className="text-gray-400 text-sm">
              {todayTotal} / {dailyGoal} exercices
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${isCompleted ? 'text-green-400' : 'text-purple-400'}`}>
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-gray-500">
            {isCompleted ? 'Objectif atteint !' : `${dailyGoal - todayTotal} restants`}
          </div>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Indicateur de progression */}
        {progress > 5 && (
          <motion.div
            className="absolute top-0 right-2 h-3 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs font-medium text-white">
              {Math.round(progress)}%
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Message de motivation */}
      {isCompleted && (
        <motion.div
          className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-green-400 text-sm text-center font-medium">
            🎉 Fantastique ! Objectif atteint pour aujourd'hui !
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};