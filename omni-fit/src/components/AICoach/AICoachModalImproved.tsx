import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, Heart, Trophy } from 'lucide-react';
import { AIChatLocal } from '@/components/AICoach/AIChatLocal';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICoachModalImproved({ isOpen, onClose }: AICoachModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop sans flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal avec design rose fuchsia */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:max-h-[90vh] md:inset-x-4 md:inset-y-auto md:top-[5%] md:bottom-[5%] md:max-w-2xl md:mx-auto bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header avec gradient rose fuchsia */}
            <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 p-6 pb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Brain className="w-8 h-8" />
                  Coach AI Personnel
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              <p className="text-fuchsia-100">Votre assistant fitness intelligent</p>
              
              {/* Quick actions */}
              <div className="flex gap-3 mt-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/30 rounded-xl px-4 py-2 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">Motivation</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/30 rounded-xl px-4 py-2 flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">Objectifs</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/30 rounded-xl px-4 py-2 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">Conseils</span>
                </motion.div>
              </div>
            </div>

            {/* Welcome message */}
            <div className="bg-gradient-to-b from-fuchsia-50 to-white dark:from-fuchsia-900/10 dark:to-gray-900 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-fuchsia-200 dark:border-fuchsia-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💬 <span className="font-medium">Coach AI</span> : Bonjour ! Je suis là pour vous aider à atteindre vos objectifs fitness. Comment puis-je vous motiver aujourd'hui ?
                </p>
              </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <AIChatLocal />
            </div>

            {/* Quick suggestions */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions rapides :</p>
              <div className="flex gap-2 overflow-x-auto">
                {[
                  "Comment améliorer ma forme ?",
                  "Exercices pour débutant",
                  "Nutrition sportive",
                  "Plan d'entraînement"
                ].map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}