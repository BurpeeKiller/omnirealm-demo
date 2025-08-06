import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Shield } from 'lucide-react';
import { useBackupNotification } from '@/hooks/useBackupNotification';

export const BackupNotification = () => {
  const { shouldShowNotification, dismissNotification, createBackup } = useBackupNotification();

  const handleCreateBackup = async () => {
    await createBackup();
  };

  return (
    <AnimatePresence>
      {shouldShowNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-gray-200">Backup recommandé</h3>
              </div>
              <button
                onClick={dismissNotification}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-400 mb-4">
              Votre progression n'est pas sauvegardée récemment. Créez un backup pour sécuriser vos
              données.
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCreateBackup}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Créer backup
              </button>
              <button
                onClick={dismissNotification}
                className="py-2 px-3 text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
