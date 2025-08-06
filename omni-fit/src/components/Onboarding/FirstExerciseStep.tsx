import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useExercisesStore } from '@/stores/exercises.store';

interface FirstExerciseStepProps {
  onNext?: () => void;
  onSkip?: () => void;
}

export const FirstExerciseStep = ({ onNext, onSkip }: FirstExerciseStepProps) => {
  const { completeFirstExercise } = useOnboarding();
  const { incrementExercise, loading } = useExercisesStore();
  const [hasCompletedExercise, setHasCompletedExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<'burpees' | 'pushups' | 'squats'>(
    'burpees',
  );

  const exercises = [
    {
      type: 'burpees' as const,
      name: 'Burpees',
      emoji: '🔥',
      description: 'Cardio intense',
    },
    {
      type: 'pushups' as const,
      name: 'Pompes',
      emoji: '💪',
      description: 'Force haut du corps',
    },
    {
      type: 'squats' as const,
      name: 'Squats',
      emoji: '🦵',
      description: 'Force jambes',
    },
  ];

  const handleExerciseClick = async (exerciseType: 'burpees' | 'pushups' | 'squats') => {
    if (hasCompletedExercise || loading) return;

    try {
      await incrementExercise(exerciseType);
      setHasCompletedExercise(true);

      // Confetti effect (simple)
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Failed to complete first exercise:', error);
    }
  };

  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = (e?: React.MouseEvent | React.TouchEvent) => {
    // Empêcher la propagation et le comportement par défaut
    e?.preventDefault();
    e?.stopPropagation();

    // Éviter les double-clics
    if (isFinishing) {
      console.log('Already finishing, ignoring click');
      return;
    }

    console.log('handleFinish called');
    setIsFinishing(true);
    
    if (onNext) {
      onNext();
    } else {
      completeFirstExercise();
      // Forcer un rechargement après un court délai pour s'assurer que l'état est sauvegardé
      setTimeout(() => {
        console.log('Reloading page to complete onboarding');
        window.location.reload();
      }, 100);
    }
  };

  return (
    <motion.div
      key="first-exercise"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-800 rounded-2xl p-8"
    >
      {/* En-tête */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Votre premier exercice !</h2>
        <p className="text-gray-400">Choisissez un exercice et commencez maintenant</p>
      </motion.div>

      {!hasCompletedExercise ? (
        <>
          {/* Sélection d'exercice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {exercises.map((exercise, index) => (
              <motion.button
                key={exercise.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => setSelectedExercise(exercise.type)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedExercise === exercise.type
                    ? 'border-primary-400 bg-primary-400/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{exercise.emoji}</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-200">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">{exercise.description}</p>
                  </div>
                  {selectedExercise === exercise.type && (
                    <CheckCircle className="w-5 h-5 text-primary-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Action principale */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <button
              onClick={() => handleExerciseClick(selectedExercise)}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                'En cours...'
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Faire 10 {exercises.find((e) => e.type === selectedExercise)?.name}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400 mt-3">
              Cliquez pour enregistrer vos premiers exercices !
            </p>
          </motion.div>
        </>
      ) : (
        /* Félicitations */
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>

          <h3 className="text-2xl font-bold text-gradient mb-4">Félicitations !</h3>

          <p className="text-gray-400 mb-8">
            Vous avez terminé votre premier exercice.
            <br />
            Votre parcours fitness commence maintenant !
          </p>

          <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-300">
              ✨ <strong>Conseil :</strong> Revenez toutes les heures pour maintenir votre rythme
            </p>
          </div>

          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg relative z-10 disabled:opacity-50"
            style={{ touchAction: 'manipulation' }}
          >
            {isFinishing ? 'Chargement...' : "Découvrir l'application"}
            {!isFinishing && <ArrowRight className="w-5 h-5" />}
          </button>

          {/* Bouton de secours si le premier ne fonctionne pas */}
          <button
            onClick={() => {
              console.log('Alternative button clicked');
              window.location.reload();
            }}
            className="w-full mt-3 py-2 text-gray-400 hover:text-gray-300 transition-colors text-sm underline"
          >
            Si le bouton ne fonctionne pas, cliquez ici
          </button>
        </motion.div>
      )}

      {/* Motivation */}
      {!hasCompletedExercise && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            💪 "Le plus dur, c'est de commencer" - Vous y êtes presque !
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
