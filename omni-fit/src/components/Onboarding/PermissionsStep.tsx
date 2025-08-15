import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNotification } from '@/hooks/useNotification';
import { logger } from '@/utils/logger';

interface PermissionsStepProps {
  onNext?: () => void;
  onSkip?: () => void;
}

export const PermissionsStep = ({ onNext, onSkip }: PermissionsStepProps) => {
  const { completePermissions } = useOnboarding();
  const {
    requestPermission,
    permission,
    isLoading: isLoadingPermission,
    isNative,
  } = useNotification();
  const [isRequesting, setIsRequesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleNotificationRequest = async () => {
    logger.info('handleNotificationRequest called');
    setIsRequesting(true);
    try {
      const result = await requestPermission();
      logger.info('Permission result:', result);
      // Si on a obtenu la permission, on peut continuer automatiquement
      if (result === 'granted') {
        setTimeout(() => {
          if (onNext) {
            onNext();
          } else {
            completePermissions(true);
          }
        }, 1000);
      }
    } catch (error) {
      logger.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleContinue = () => {
    logger.info('handleContinue called, permission:', permission);
    if (onNext) {
      onNext();
    } else {
      completePermissions(permission === 'granted');
    }
  };

  const handleSkipStep = () => {
    logger.info('handleSkip called');
    if (onSkip) {
      onSkip();
    } else {
      completePermissions(false);
    }
  };

  const getNotificationStatus = () => {
    switch (permission) {
      case 'granted':
        return { icon: CheckCircle, text: 'Autorisées', color: 'text-green-400' };
      case 'denied':
        return { icon: XCircle, text: 'Refusées', color: 'text-red-400' };
      default:
        return { icon: Bell, text: 'En attente', color: 'text-gray-400' };
    }
  };

  const notificationStatus = getNotificationStatus();

  return (
    <motion.div
      key="permissions"
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
        <div className="text-5xl mb-4">🔔</div>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Personnaliser l'expérience</h2>
        <p className="text-gray-400">Configurez vos préférences (optionnel)</p>
      </motion.div>

      {/* Options */}
      <div className="space-y-6 mb-8">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-200">Notifications</h3>
                <p className="text-sm text-gray-400">Rappels d'exercices</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${notificationStatus.color}`}>
              <notificationStatus.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{notificationStatus.text}</span>
            </div>
          </div>

          {permission === 'default' && (
            <button
              onClick={handleNotificationRequest}
              disabled={isRequesting}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm rounded-lg transition-colors"
            >
              {isRequesting ? 'Demande en cours...' : 'Autoriser les notifications'}
            </button>
          )}

          {permission === 'denied' && (
            <div className="text-xs text-gray-500 bg-gray-600/50 p-3 rounded-lg">
              💡 Vous pouvez activer les notifications plus tard dans les paramètres{' '}
              {isNative ? 'de votre téléphone' : 'de votre navigateur'}
            </div>
          )}

          {permission === 'granted' && (
            <div className="text-xs text-green-400 bg-green-400/10 p-3 rounded-lg">
              ✅ Parfait ! Vous recevrez des rappels personnalisés
            </div>
          )}
        </motion.div>

        {/* Son */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-700/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-200">Sons</h3>
                <p className="text-sm text-gray-400">Feedback audio</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-primary-400' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Confidentialité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span>100% privé et local</span>
        </div>
        <p className="text-xs text-gray-500">
          Aucune donnée n'est envoyée vers des serveurs externes. Tout reste sur votre appareil.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        <button
          onClick={handleContinue}
          className="w-full py-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Continuer
        </button>

        <button
          onClick={handleSkipStep}
          className="w-full py-2 text-gray-400 hover:text-gray-300 transition-colors text-sm"
        >
          Configurer plus tard
        </button>
      </motion.div>
    </motion.div>
  );
};
