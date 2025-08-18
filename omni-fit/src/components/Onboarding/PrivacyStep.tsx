import { motion } from 'framer-motion';
import { Shield, Database, Smartphone, Cloud, Lock, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export function PrivacyStep() {
  const { completeWelcome } = useOnboarding();
  return (
    <div className="text-center max-w-md mx-auto p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <Shield className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold mb-4 text-white">
        Vos données sont protégées
      </h2>
      
      <p className="text-gray-300 mb-8 text-lg">
        Votre confidentialité est notre priorité absolue
      </p>

      <div className="space-y-4 text-left mb-8">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg"
        >
          <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">100% Local</h3>
            <p className="text-gray-400 text-sm">
              Toutes vos données d'exercices restent sur votre appareil. 
              Aucune information n'est envoyée sur internet.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg"
        >
          <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
            <Smartphone className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Mode Hors-ligne</h3>
            <p className="text-gray-400 text-sm">
              L'application fonctionne parfaitement sans connexion internet. 
              Vos rappels et statistiques sont toujours accessibles.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg"
        >
          <div className="bg-fuchsia-500/20 p-2 rounded-lg mt-1">
            <Cloud className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Coach AI Hybride</h3>
            <p className="text-gray-400 text-sm">
              Le Coach AI propose des conseils prédéfinis en local. 
              Pour des réponses personnalisées, une connexion optionnelle 
              peut être utilisée (avec votre accord).
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg"
        >
          <div className="bg-green-500/20 p-2 rounded-lg mt-1">
            <Lock className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Backup Sécurisé</h3>
            <p className="text-gray-400 text-sm">
              Vos sauvegardes sont chiffrées localement. 
              Vous gardez le contrôle total de vos données.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">
            Aucun compte requis • Aucun tracking • Aucune publicité
          </p>
        </div>
      </motion.div>

      <motion.button
        onClick={completeWelcome}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg"
      >
        J'ai compris, continuer
      </motion.button>

      <p className="text-gray-500 text-xs mt-4">
        En utilisant l'application, vous acceptez notre approche 
        de confidentialité totale
      </p>
    </div>
  );
}