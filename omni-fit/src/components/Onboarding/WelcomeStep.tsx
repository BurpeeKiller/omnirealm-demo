import { motion } from 'framer-motion';
import { Zap, Target, Award } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export const WelcomeStep = () => {
  const { completeWelcome, skipOnboarding } = useOnboarding();

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

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-800 rounded-2xl p-8 text-center"
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
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Restez en forme en 30 secondes par jour
        </h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-400/20 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-200">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <button
          onClick={completeWelcome}
          onTouchStart={completeWelcome} // Pour mobile - touchstart est plus réactif
          className="w-full py-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all touch-manipulation cursor-pointer select-none relative z-10"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: 'auto' // Force l'interactivité
          }}
        >
          Commencer ✨
        </button>

        <button
          onClick={skipOnboarding}
          onTouchStart={skipOnboarding} // Pour mobile
          className="w-full py-2 text-gray-400 hover:text-gray-300 active:text-gray-200 transition-colors text-sm cursor-pointer relative z-10"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: 'auto' // Force l'interactivité
          }}
        >
          Passer l'introduction
        </button>
      </motion.div>

      {/* Message sécurité des données */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 p-4 bg-green-800/20 rounded-lg border border-green-700/30"
      >
        <p className="text-xs text-green-300">
          🔒 <strong>Sécurité :</strong> Toutes vos données restent sur votre appareil. Aucune information n'est envoyée vers des serveurs externes.
        </p>
      </motion.div>

      {/* Bonus motivation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-3 p-4 bg-gray-700/50 rounded-lg"
      >
        <p className="text-xs text-gray-400">
          💡 <strong>Conseil Pro :</strong> 3 minutes d'exercices = 30 minutes d'énergie en plus
        </p>
      </motion.div>
    </motion.div>
  );
};
