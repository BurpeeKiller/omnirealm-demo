import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Calendar, AlertCircle, Loader } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

export function SubscriptionManager() {
  const { isPremium, subscriptionStatus, manageSubscription, loading } = useSubscription();
  const { user } = useAuth();
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  if (!user) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Connectez-vous pour gérer votre abonnement</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut actuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-lg hover:border-gray-600 border border-transparent cursor-default"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Votre Abonnement
          </h3>
          {isPremium && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
              Premium Actif
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span>
              Plan : {isPremium ? 'OmniFit Premium' : 'Gratuit'}
            </span>
          </div>

          {subscriptionStatus.currentPeriodEnd && (
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>
                Prochaine facturation : {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}

          {subscriptionStatus.cancelAtPeriodEnd && (
            <div className="flex items-center gap-3 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                Votre abonnement sera annulé le {new Date(subscriptionStatus.currentPeriodEnd!).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <button
            onClick={manageSubscription}
            disabled={loading}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Gérer mon abonnement
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Modifiez votre plan, mettez à jour vos informations de paiement ou annulez votre abonnement
          </p>
        </motion.div>
      )}

      {/* Modal d'avertissement annulation */}
      {showCancelWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCancelWarning(false)}
        >
          <motion.div
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Êtes-vous sûr de vouloir annuler ?
            </h3>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-300">Vous perdrez l'accès à :</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Coach IA personnalisé</li>
                <li>• Exercices illimités</li>
                <li>• Statistiques avancées</li>
                <li>• Support prioritaire</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelWarning(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Garder Premium
              </button>
              <button
                onClick={async () => {
                  await manageSubscription();
                  setShowCancelWarning(false);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Continuer l'annulation
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}