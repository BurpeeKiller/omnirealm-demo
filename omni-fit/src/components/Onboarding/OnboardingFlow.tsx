import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { WelcomePrivacyStep } from './WelcomePrivacyStep';
import { PermissionsStep } from './PermissionsStep';
import { FirstExerciseStep } from './FirstExerciseStep';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps = {}) => {
  const { state, shouldShowOnboarding, skipOnboarding, completeOnboarding } = useOnboarding();

  // Raccourci clavier ESC pour fermer l'onboarding
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipOnboarding();
        if (onComplete) {
          onComplete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [skipOnboarding, onComplete]);

  // Appeler onComplete quand l'onboarding est complété
  useEffect(() => {
    if (state.isCompleted && onComplete) {
      onComplete();
    }
  }, [state.isCompleted, onComplete]);

  // Logs désactivés pour réduire la pollution de la console
  // logger.info('OnboardingFlow - currentStep:', state.currentStep);

  if (!shouldShowOnboarding || state.isCompleted) {
    return null;
  }

  // Si on est à l'étape 3 ou plus, on considère que c'est terminé
  if (state.currentStep >= 3) {
    // Délai pour éviter les conflits d'état
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        completeOnboarding();
      }
    }, 100);
    return null;
  }

  const stepComponents = [
    <WelcomePrivacyStep key="welcome-privacy" />,
    <PermissionsStep key="permissions" />,
    <FirstExerciseStep key="first-exercise" />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md">
        {/* Indicateur de progression */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  step === state.currentStep
                    ? 'bg-primary-400'
                    : step < state.currentStep
                      ? 'bg-primary-600'
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">Étape {state.currentStep + 1} sur 3</p>
        </div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">{stepComponents[state.currentStep]}</AnimatePresence>
      </div>
    </motion.div>
  );
};
