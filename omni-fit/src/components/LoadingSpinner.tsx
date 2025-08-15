import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-rose-200 dark:border-rose-800 border-t-rose-600 rounded-full mx-auto"
        />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Chargement...
        </p>
      </div>
    </div>
  );
}