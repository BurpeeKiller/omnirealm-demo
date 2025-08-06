import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { ProgressiveOnboarding } from './ProgressiveOnboarding';
import { useProgressiveOnboarding } from '@/hooks/useProgressiveOnboarding';

export const OnboardingTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shouldShow, setShowOnboarding, complete, isFirstVisit } = useProgressiveOnboarding();

  // Montrer automatiquement à la première visite
  useState(() => {
    if (shouldShow && isFirstVisit) {
      setIsModalOpen(true);
    }
  });

  const handleOpenOnboarding = () => {
    setIsModalOpen(true);
  };

  const handleCloseOnboarding = () => {
    setIsModalOpen(false);
    setShowOnboarding(false);
  };

  const handleCompleteOnboarding = () => {
    complete();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Bouton pour ouvrir l'onboarding */}
      <motion.button
        onClick={handleOpenOnboarding}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-4 left-4 z-40 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
        aria-label="Ouvrir le guide"
      >
        {isFirstVisit ? <Sparkles className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
      </motion.button>

      {/* Badge "Nouveau" pour les nouveaux utilisateurs */}
      {isFirstVisit && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-14 left-6 z-40 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
        >
          Nouveau
        </motion.div>
      )}

      {/* Onboarding modal */}
      <ProgressiveOnboarding
        isOpen={isModalOpen}
        onClose={handleCloseOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </>
  );
};
