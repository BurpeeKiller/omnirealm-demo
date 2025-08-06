import { useState } from 'react';
import { X } from 'lucide-react';
import { WelcomePrivacyStep } from './WelcomePrivacyStep';
import { PermissionsStep } from './PermissionsStep';
import { FirstExerciseStep } from './FirstExerciseStep';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(0); // Reset step when closing
    onClose();
  };

  const handleStepComplete = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const stepComponents = [
    <WelcomePrivacyStep key="welcome-privacy" onNext={handleStepComplete} onSkip={handleSkip} />,
    <PermissionsStep key="permissions" onNext={handleStepComplete} onSkip={handleSkip} />,
    <FirstExerciseStep key="first-exercise" onNext={handleStepComplete} onSkip={handleSkip} />,
  ];

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-auto">
      {/* Overlay avec fermeture au clic */}
      <div 
        className="absolute inset-0 bg-black/80 pointer-events-auto" 
        onClick={handleClose} 
      />

      {/* Contenu modal */}
      <div className="relative h-full flex items-center justify-center p-4 pointer-events-none">
        {/* Bouton fermer toujours visible */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-[1002] bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg pointer-events-auto"
          aria-label="Fermer l'onboarding"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Onboarding content */}
        <div className="relative z-[1001] w-full max-w-md pointer-events-auto">
          {/* Indicateur de progression */}
          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-primary-400'
                      : step < currentStep
                        ? 'bg-primary-600'
                        : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">Étape {currentStep + 1} sur 3</p>
          </div>

          {/* Contenu de l'étape */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
