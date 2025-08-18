import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorNotificationData {
  id: string;
  message: string;
}

export function ErrorNotification() {
  const [errors, setErrors] = useState<ErrorNotificationData[]>([]);

  useEffect(() => {
    const handleError = (event: CustomEvent<{ message: string }>) => {
      const newError: ErrorNotificationData = {
        id: Date.now().toString(),
        message: event.detail.message,
      };
      
      setErrors(prev => [...prev, newError]);
      
      // Auto-dismiss après 5 secondes
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.id !== newError.id));
      }, 5000);
    };

    window.addEventListener('omnifit:error', handleError as EventListener);
    
    return () => {
      window.removeEventListener('omnifit:error', handleError as EventListener);
    };
  }, []);

  const dismissError = (id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {errors.map(error => (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="mb-3 pointer-events-auto"
          >
            <div className="bg-red-900/90 bg-opacity-95 border border-red-700 rounded-lg p-4 shadow-xl max-w-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-100">{error.message}</p>
                </div>
                <button
                  onClick={() => dismissError(error.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Fermer la notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}