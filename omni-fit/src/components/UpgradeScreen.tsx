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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Passez à OmniFit Premium
                </h2>
                <p className="text-gray-400">
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
        <div className="p-6 space-y-8">
          {/* 3 arguments de vente principaux */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-800/50 rounded-xl">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Coach IA Personnel</h3>
              <p className="text-gray-400 text-sm">
                Conseils personnalisés basés sur vos performances et objectifs
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-xl">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Analytics Avancées</h3>
              <p className="text-gray-400 text-sm">
                Suivez vos progrès avec des insights détaillés et des tendances
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-xl">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Programmes Sur Mesure</h3>
              <p className="text-gray-400 text-sm">
                Plans d'entraînement adaptés à votre niveau et vos objectifs
              </p>
            </div>
          </div>

          {/* Plans de tarification */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Mensuel */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Mensuel</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">29€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Annulez à tout moment</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>7 jours d'essai gratuit</span>
                  </li>
                </ul>
              </div>
            </button>

            {/* Plan Annuel */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                2 MOIS OFFERTS
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Annuel</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">290€</span>
                  <span className="text-gray-400">/an</span>
                  <div className="text-green-400 text-sm mt-1">
                    Économisez 58€
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Prix bloqué à vie</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
            </button>
          </div>

          {/* Toutes les fonctionnalités */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">
              Tout ce qui est inclus dans Premium
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {PRICING_PLANS[0].features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-400 text-sm text-center">
              Pas de carte requise pour l'essai • Annulez à tout moment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}