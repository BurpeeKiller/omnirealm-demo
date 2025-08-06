import { motion } from 'framer-motion';
import { Zap, Target, Award, Shield, Database, Lock, CheckCircle, FileCheck } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

interface WelcomePrivacyStepProps {
  onNext?: () => void;
  onSkip?: () => void;
}

export const WelcomePrivacyStep = ({ onNext, onSkip }: WelcomePrivacyStepProps) => {
  const { completeWelcome, skipOnboarding } = useOnboarding();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      completeWelcome();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      skipOnboarding();
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Exercices Express',
      description: 'Burpees, pompes, squats en 1 clic',
    },
    {
      icon: Target,
      title: 'Objectifs Quotidiens',
      description: '10 exercices par jour minimum',
    },
    {
      icon: Award,
      title: 'Suivi de Progression',
      description: 'Analytics et séries de réussite',
    },
  ];

  const privacyFeatures = [
    {
      icon: Database,
      title: '100% Local',
      description: 'Toutes vos données restent sur votre appareil',
    },
    {
      icon: Shield,
      title: 'Mode Hors-ligne',
      description: 'Fonctionne sans connexion internet',
    },
    {
      icon: Lock,
      title: 'Backup Sécurisé',
      description: 'Vos sauvegardes sont chiffrées localement',
    },
  ];

  return (
    <motion.div
      key="welcome-privacy"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-800 rounded-2xl p-8 text-center max-h-[90vh] overflow-y-auto"
    >
      {/* En-tête */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="text-6xl mb-4">💪</div>
        <h1 className="text-2xl font-bold text-gradient mb-2">OmniFit</h1>
        <p className="text-gray-400">Votre coach fitness personnel</p>
      </motion.div>

      {/* Promesse de valeur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Restez en forme en 30 secondes par jour
        </h2>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary-400/20 rounded-lg flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-200 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Confidentialité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Vos données sont protégées</h3>
        </div>
        
        <div className="space-y-3">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-3 text-left bg-gray-700/30 p-3 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-200 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Message de sécurité consolidé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mb-4 p-3 bg-green-800/20 rounded-lg border border-green-700/30"
      >
        <p className="text-xs text-green-300">
          🔒 <strong>100% Privé :</strong> Aucun compte requis • Aucun tracking • Aucune publicité
        </p>
      </motion.div>

      {/* Conformité RGPD et AI Act */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15 }}
        className="mb-6 space-y-2"
      >
        <h4 className="text-sm font-semibold text-gray-200 mb-3">Conformité légale</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-blue-800/20 p-2 rounded-lg border border-blue-700/30">
            <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-medium text-blue-300">RGPD Compliant</p>
              <p className="text-xs text-gray-400">Conforme au règlement européen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-800/20 p-2 rounded-lg border border-purple-700/30">
            <FileCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-medium text-purple-300">AI Act Ready</p>
              <p className="text-xs text-gray-400">IA transparente et éthique</p>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Vos données personnelles ne sont jamais collectées, vendues ou partagées.
            <br />
            L'IA (optionnelle) utilise votre propre clé API pour garantir la confidentialité.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="space-y-3"
      >
        <button
          onClick={handleNext}
          onTouchStart={handleNext}
          className="w-full py-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all touch-manipulation cursor-pointer select-none relative z-10"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: 'auto'
          }}
        >
          Commencer en toute sécurité ✨
        </button>

        <button
          onClick={handleSkip}
          onTouchStart={handleSkip}
          className="w-full py-2 text-gray-400 hover:text-gray-300 active:text-gray-200 transition-colors text-sm cursor-pointer relative z-10"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: 'auto'
          }}
        >
          Passer l'introduction
        </button>
      </motion.div>
    </motion.div>
  );
};