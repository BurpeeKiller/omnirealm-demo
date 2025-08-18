import { useState } from 'react';
import { Crown, Check, X, Zap, Brain, TrendingUp } from 'lucide-react';
import { subscriptionService, PRICING_PLANS } from '../services/subscription';
import { logger } from '@/utils/logger';

interface UpgradeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeScreen({ isOpen, onClose }: UpgradeScreenProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const plan = PRICING_PLANS.find(p => 
        p.interval === (selectedPlan === 'monthly' ? 'month' : 'year')
      );
      
      if (plan?.stripePriceId) {
        await subscriptionService.redirectToCheckout(plan.stripePriceId);
      }
    } catch (error) {
      logger.error('Erreur upgrade:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 p-4 sm:p-6 border-b border-gray-800 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Passez à OmniFit Premium
                </h2>
                <p className="text-gray-400 text-sm sm:text-base hidden sm:block">
                  Débloquez tout le potentiel de votre entraînement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* 3 arguments de vente principaux */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-gray-800/50 rounded-lg">
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Coach IA Personnel</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Conseils personnalisés basés sur vos performances et objectifs
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-800/50 rounded-lg">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Analytics Avancées</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Suivez vos progrès avec des insights détaillés et des tendances
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-800/50 rounded-lg">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Programmes Sur Mesure</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Plans d'entraînement adaptés à votre niveau et vos objectifs
              </p>
            </div>
          </div>

          {/* Plans de tarification */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Plan Mensuel */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`relative p-4 sm:p-6 rounded-lg border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Mensuel</h3>
                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold">29€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Annulez à tout moment</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>7 jours d'essai gratuit</span>
                  </li>
                </ul>
              </div>
            </button>

            {/* Plan Annuel */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`relative p-4 sm:p-6 rounded-lg border-2 transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 sm:px-3 rounded-full">
                2 MOIS OFFERTS
              </div>
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Annuel</h3>
                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold">290€</span>
                  <span className="text-gray-400">/an</span>
                  <div className="text-green-400 text-xs sm:text-sm mt-1">
                    Économisez 58€
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Prix bloqué à vie</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
            </button>
          </div>

          {/* Toutes les fonctionnalités */}
          <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4">
              Tout ce qui est inclus dans Premium
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
              {PRICING_PLANS[0].features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pb-4">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : (
                <span>
                  Commencer l'essai gratuit de 7 jours
                </span>
              )}
            </button>
            <p className="text-gray-400 text-xs sm:text-sm text-center">
              Pas de carte requise pour l'essai • Annulez à tout moment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}