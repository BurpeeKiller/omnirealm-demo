import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useExercisesStore } from '@/stores/exercises.store';
import type { Exercise } from '@/types';
import { useVibration } from '@/hooks/useVibration';
import { playSound } from '@/services/sound';
import { confetti } from '@/utils/confetti';
import { gradientClasses } from '@/styles/theme';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const { incrementExercise, loading } = useExercisesStore();
  const { vibrate } = useVibration();

  const handleClick = async () => {
    if (loading) return;

    try {
      // Incrémenter l'exercice
      await incrementExercise(exercise.type);

      // Effets visuels et sonores
      vibrate();
      playSound('success');

      // Confetti pour les milestones
      const newCount = exercise.count + exercise.increment;
      if (newCount % 50 === 0) {
        confetti();
      }
    } catch (error) {
      console.error('Failed to increment exercise:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.95 }}
      className={`exercise-card cursor-pointer select-none ${
        index === 0 ? gradientClasses.primary : 
        index === 1 ? gradientClasses.secondary : 
        gradientClasses.accent
      } p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-white/10`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      data-testid={`exercise-card-${exercise.type}`}
      aria-label={`${exercise.name}: ${exercise.count} répétitions`}
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl mb-2">{exercise.emoji}</div>
        <h3 className="text-lg font-semibold text-white mb-3">{exercise.name}</h3>

        {/* Counter */}
        <div className="text-3xl font-bold text-white mb-4 animate-number">{exercise.count}</div>

        {/* Increment button */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-white font-medium"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">+{exercise.increment}</span>
        </button>
      </div>
    </motion.div>
  );
}
