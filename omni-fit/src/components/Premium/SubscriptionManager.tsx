import { motion } from 'framer-motion';
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const SubscriptionManager = () => {
  const { subscriptionStatus, isPremium, manageSubscription, loading } = useSubscription();

  if (!isPremium && subscriptionStatus.type !== 'trial') {
    return null;
  }

  const getStatusIcon = () => {
    switch (subscriptionStatus.status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'past_due':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'canceled':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Crown className="w-5 h-5 text-purple-400" />;
    }
  };

  const getStatusText = () => {
    switch (subscriptionStatus.status) {
      case 'active':
        return 'Actif';
      case 'past_due':
        return 'Paiement en retard';
      case 'canceled':
        return 'Annulé';
      case 'trialing':
        return 'Période d\'essai';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = () => {
    switch (subscriptionStatus.status) {
      case 'active':
        return 'text-green-400';
      case 'past_due':
        return 'text-yellow-400';
      case 'canceled':
        return 'text-red-400';
      case 'trialing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-400" />
          Mon Abonnement
        </h3>
        {getStatusIcon()}
      </div>

      <div className="space-y-3">
        {/* Statut */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Statut</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Type d'abonnement */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Plan</span>
          <span className="text-white font-medium">
            {subscriptionStatus.type === 'premium' ? 'OmniFit Premium' : 'Essai Gratuit'}
          </span>
        </div>

        {/* Date de fin */}
        {subscriptionStatus.currentPeriodEnd && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Renouvellement
            </span>
            <span className="text-white">
              {format(subscriptionStatus.currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        )}

        {/* Date de fin d'essai */}
        {subscriptionStatus.trialEnd && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fin de l'essai
            </span>
            <span className="text-white">
              {format(subscriptionStatus.trialEnd, 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        )}

        {/* Annulation prévue */}
        {subscriptionStatus.cancelAtPeriodEnd && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Votre abonnement sera annulé à la fin de la période
            </p>
          </div>
        )}
      </div>

      {/* Bouton de gestion */}
      {isPremium && (
        <button
          onClick={manageSubscription}
          disabled={loading}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          {loading ? 'Chargement...' : 'Gérer mon abonnement'}
        </button>
      )}

      {/* Message d'essai */}
      {subscriptionStatus.type === 'trial' && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
          <p className="text-sm text-blue-400">
            Profitez de toutes les fonctionnalités premium pendant votre période d'essai !
          </p>
        </div>
      )}
    </motion.div>
  );
};