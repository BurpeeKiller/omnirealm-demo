import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { AIChat } from '@/components/AICoach/AIChat';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICoachModal({ isOpen, onClose }: AICoachModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-x-4 top-20 bottom-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg md:w-full bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Coach AI</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden">
              <AIChat />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}