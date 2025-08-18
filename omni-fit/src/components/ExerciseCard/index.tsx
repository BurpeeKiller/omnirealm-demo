import { motion, AnimatePresence } from 'framer-motion';
import type { ExerciseDefinition } from '@/types';
import { Plus } from 'lucide-react';
import { useExercisesStore } from '@/stores/exercises.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useSound } from '@/utils/sound';
import { useGamificationStore } from '@/stores/gamification.store';
import { useState } from 'react';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  index: number;
}

export const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const { incrementExercise, loading } = useExercisesStore();
  const { soundEnabled } = useSettingsStore();
  const { playComplete } = useSound();
  const { recordExercise } = useGamificationStore();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleIncrement = async () => {
    if (loading) return;

    // Afficher le feedback visuel
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);

    // Play sound
    if (soundEnabled) {
      playComplete();
    }

    // Vibrate
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    await incrementExercise(exercise.type);
    
    // Enregistrer pour la gamification
    recordExercise(exercise.type);
  };

  return (
    <motion.div
      className="exercise-card cursor-pointer select-none hover:translate-y-[-2px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={handleIncrement}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center relative">
        <div className="text-5xl lg:text-6xl mb-3">{exercise.emoji}</div>
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-200 mb-4">{exercise.name}</h3>
        <div className="text-4xl lg:text-5xl font-bold text-gradient mb-5 animate-number relative">
          {exercise.count}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -30, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-3xl lg:text-4xl font-bold text-green-400">+{exercise.increment}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          className="flex items-center gap-2 px-5 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg lg:text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="font-medium">+{exercise.increment}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
