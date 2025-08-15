import { motion } from 'framer-motion';
import type { ExerciseDefinition } from '@/types';
import { Plus } from 'lucide-react';
import { useExercisesStore } from '@/stores/exercises.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useSound } from '@/utils/sound';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  index: number;
}

export const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const { incrementExercise, loading } = useExercisesStore();
  const { soundEnabled } = useSettingsStore();
  const { playComplete } = useSound();

  const handleIncrement = async () => {
    if (loading) return;

    // Play sound
    if (soundEnabled) {
      playComplete();
    }

    // Vibrate
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    await incrementExercise(exercise.type);
  };

  return (
    <motion.div
      className="exercise-card cursor-pointer select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={handleIncrement}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl mb-2">{exercise.emoji}</div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">{exercise.name}</h3>
        <div className="text-3xl font-bold text-gradient mb-4 animate-number">{exercise.count}</div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">+{exercise.increment}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
