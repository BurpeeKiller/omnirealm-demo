import { motion } from 'framer-motion';
import { useExercisesStore } from '@/stores/exercises.store';
import { useSettingsStore } from '@/stores/settings.store';
import { Target, TrendingUp, Dumbbell, Trophy, Flame, Timer } from 'lucide-react';
import { useMemo } from 'react';

export const DailyStats = () => {
  const { todayTotal, exercises = [] } = useExercisesStore();
  const { dailyGoal } = useSettingsStore();

  const progress = Math.min((todayTotal / dailyGoal) * 100, 100);
  
  // Calculer les stats par exercice pour aujourd'hui
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayExercises = (exercises || []).filter(ex => ex?.date && new Date(ex.date).toDateString() === today);
    
    const stats = {
      pushups: todayExercises.filter(ex => ex.type === 'pushup').reduce((sum, ex) => sum + ex.count, 0),
      squats: todayExercises.filter(ex => ex.type === 'squat').reduce((sum, ex) => sum + ex.count, 0),
      abs: todayExercises.filter(ex => ex.type === 'abs').reduce((sum, ex) => sum + ex.count, 0),
      totalSessions: todayExercises.length,
      estimatedCalories: Math.round(todayTotal * 0.5), // Estimation grossière
      estimatedTime: Math.round(todayTotal * 0.1) // Estimation en minutes
    };
    
    return stats;
  }, [exercises, todayTotal]);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 mx-4 mb-6 transition-all duration-200 hover:shadow-lg hover:border-gray-600 border border-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête avec titre et total */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Aujourd'hui
        </h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {todayTotal}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Objectif journalier
          </span>
          <span className="text-gray-300 font-medium">{dailyGoal} répétitions</span>
        </div>

        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="text-center text-sm">
          {progress >= 100 ? (
            <motion.span 
              className="text-green-400 font-medium"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              ✨ Objectif atteint! Félicitations! 🎉
            </motion.span>
          ) : progress === 0 ? (
            <span className="text-gray-400">
              Commencez votre journée en beauté! 💪
            </span>
          ) : (
            <span className="text-gray-400">
              Plus que <span className="text-white font-medium">{dailyGoal - todayTotal}</span> répétitions
            </span>
          )}
        </div>
      </div>

      {/* Grille de stats détaillées */}
      <div className="grid grid-cols-2 gap-4">
        {/* Répartition par exercice */}
        <div className="bg-gray-900/50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-900/70">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Répartition</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Pompes</span>
              <span className="text-sm font-medium text-white">{todayStats.pushups}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Squats</span>
              <span className="text-sm font-medium text-white">{todayStats.squats}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Abdos</span>
              <span className="text-sm font-medium text-white">{todayStats.abs}</span>
            </div>
          </div>
        </div>

        {/* Stats supplémentaires */}
        <div className="bg-gray-900/50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-900/70">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Performance</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                Sessions
              </span>
              <span className="text-sm font-medium text-white">{todayStats.totalSessions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Calories
              </span>
              <span className="text-sm font-medium text-white">~{todayStats.estimatedCalories}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Temps
              </span>
              <span className="text-sm font-medium text-white">{todayStats.estimatedTime} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message motivationnel */}
      {todayTotal === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-purple-900/30 rounded-lg text-center transition-all duration-200 hover:bg-purple-900/40 cursor-default"
        >
          <p className="text-sm text-purple-300">
            💡 Conseil: Commencez par une série de 10 répétitions de votre exercice préféré!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
