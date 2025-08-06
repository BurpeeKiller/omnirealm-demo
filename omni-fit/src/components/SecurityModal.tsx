import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Database, Cloud, Key, Eye, Server } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal = ({ isOpen, onClose }: SecurityModalProps) => {
  if (!isOpen) return null;

  const securityFeatures = [
    {
      icon: Database,
      title: 'Workouts en Local',
      description: 'Vos exercices et progrès restent sur votre appareil. Privacy-first.',
      color: 'green'
    },
    {
      icon: Lock,
      title: 'Compte Sécurisé',
      description: 'Authentification chiffrée avec Supabase pour vos fonctionnalités premium.',
      color: 'blue'
    },
    {
      icon: Eye,
      title: 'Données Anonymisées',
      description: 'Analytics minimales et anonymes. Pas de tracking personnel.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Mode Hors-ligne',
      description: 'Vos workouts fonctionnent sans connexion internet.',
      color: 'orange'
    }
  ];

  const apiFeatures = [
    {
      icon: Key,
      title: 'Votre Propre Clé API',
      description: 'Utilisez votre clé OpenAI personnelle pour le Coach AI avancé.',
      color: 'red'
    },
    {
      icon: Cloud,
      title: 'Connexion Directe',
      description: 'Communication directe avec OpenAI, sans intermédiaire.',
      color: 'indigo'
    },
    {
      icon: Server,
      title: 'Aucun Stockage Cloud',
      description: 'Les conversations AI ne sont jamais stockées sur nos serveurs.',
      color: 'teal'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-gray-900 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Votre Vie Privée est Protégée</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Section Sécurité Locale */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">🔒 Sécurité Totale en Local</h3>
                <div className="grid gap-4">
                  {securityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 bg-gray-800 rounded-xl"
                      >
                        <div className={`p-3 rounded-lg bg-${feature.color}-500/20`}>
                          <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-100">{feature.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Section Mode IA */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">🤖 Mode IA Sécurisé (Optionnel)</h3>
                <div className="grid gap-4">
                  {apiFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex gap-4 p-4 bg-gray-800 rounded-xl"
                      >
                        <div className={`p-3 rounded-lg bg-${feature.color}-500/20`}>
                          <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-100">{feature.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Message Important */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-700/50"
              >
                <h4 className="font-semibold text-green-300 mb-2">🌟 Notre Engagement</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  OmniFit a été conçu dès le départ avec la confidentialité comme priorité absolue. 
                  Contrairement aux autres apps fitness, nous ne collectons AUCUNE donnée personnelle, 
                  nous n'avons pas de serveurs, et nous ne vendons rien à personne. 
                  Votre parcours fitness reste 100% privé, comme il se doit.
                </p>
              </motion.div>

              {/* Configuration API */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 p-4 bg-gray-800 rounded-xl"
              >
                <p className="text-sm text-gray-400">
                  💡 <strong className="text-gray-200">Astuce :</strong> Pour activer le Coach AI avancé, 
                  ajoutez votre clé API OpenAI dans les Réglages. Vos conversations restent privées 
                  car elles passent directement entre votre appareil et OpenAI.
                </p>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                J'ai compris - Mes données sont en sécurité
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};