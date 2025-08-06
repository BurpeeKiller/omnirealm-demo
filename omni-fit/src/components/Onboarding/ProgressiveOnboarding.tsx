import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Bell, Zap, TrendingUp } from 'lucide-react';

interface ProgressiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
  skippable: boolean;
}

export const ProgressiveOnboarding = ({
  isOpen,
  onClose,
  onComplete,
}: ProgressiveOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue dans OmniFit',
      description: 'Transformez votre routine quotidienne avec des exercices simples et efficaces',
      icon: <Zap className="w-8 h-8 text-primary-400" />,
      skippable: false,
    },
    {
      id: 'notifications',
      title: 'Restez motivé',
      description: 'Activez les rappels pour ne jamais manquer vos exercices (optionnel)',
      icon: <Bell className="w-8 h-8 text-blue-400" />,
      action: requestNotifications,
      skippable: true,
    },
    {
      id: 'tracking',
      title: 'Suivez vos progrès',
      description: 'Vos données restent privées et locales sur votre appareil',
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      skippable: true,
    },
  ];

  async function requestNotifications() {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Notification de test
          new Notification('OmniFit', {
            body: 'Parfait ! Vous recevrez des rappels personnalisés.',
            icon: '/icon-192.png',
          });
        }
      }
    } catch (error) {
      console.log('Notifications not supported or denied');
    }
  }

  const handleNext = () => {
    const step = steps[currentStep];

    // Marquer comme complété
    setCompletedSteps((prev) => [...prev, step.id]);

    // Exécuter l'action si elle existe
    if (step.action) {
      step.action();
    }

    // Passer à l'étape suivante ou terminer
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsClosing(true);

    // Sauvegarder l'état
    localStorage.setItem(
      'omnifit-onboarding-v2',
      JSON.stringify({
        completed: true,
        completedSteps,
        version: 2,
        timestamp: Date.now(),
      }),
    );

    // Fermer après animation
    setTimeout(() => {
      onComplete();
      onClose();
    }, 300);
  };

  const handleClose = () => {
    handleComplete();
  };

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Contenu */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              {/* Indicateur de progression */}
              <div className="flex gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-primary-400'
                        : index < currentStep
                          ? 'bg-primary-600'
                          : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Contenu de l'étape */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                {/* Icône */}
                <div className="flex justify-center mb-4">{step.icon}</div>

                {/* Titre */}
                <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>

                {/* Description */}
                <p className="text-gray-300 mb-8 leading-relaxed">{step.description}</p>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleNext}
                    disabled={isClosing}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLastStep ? 'Commencer' : 'Continuer'}
                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  </button>

                  {step.skippable && (
                    <button
                      onClick={handleSkip}
                      disabled={isClosing}
                      className="w-full py-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                      {isLastStep ? 'Passer cette étape' : 'Ignorer'}
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Note de confidentialité */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Vos workouts restent sur votre appareil, votre compte est protégé dans le cloud
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
