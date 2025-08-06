import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Brain, Trophy, Shield, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export const UpgradePrompt = ({ isOpen, onClose, feature }: UpgradePromptProps) => {
  const { plans, subscribeToPlan, loading, isInTrial, trialDaysRemaining, startTrial } = useSubscription();

  if (!isOpen) return null;

  const monthlyPlan = plans.find(p => p.interval === 'month');
  const yearlyPlan = plans.find(p => p.interval === 'year');

  const benefits = [
    { icon: Brain, text: 'Coach IA personnalisé', color: 'text-purple-400' },
    { icon: Zap, text: 'Programmes sur mesure', color: 'text-yellow-400' },
    { icon: Trophy, text: 'Challenges exclusifs', color: 'text-orange-400' },
    { icon: Shield, text: 'Support prioritaire', color: 'text-green-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="inline-block mb-4"
            >
              <Crown className="w-16 h-16 text-yellow-300" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Passez à OmniFit Premium
            </h2>
            <p className="text-white/90">
              {feature 
                ? `Débloquez ${feature} et bien plus encore`
                : 'Transformez votre entraînement avec l\'IA'
              }
            </p>
          </div>
        </div>

        {/* Bénéfices */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                <span className="text-gray-300">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Plans de tarification */}
          <div className="space-y-4">
            {/* Plan Mensuel */}
            {monthlyPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Mensuel</h3>
                    <p className="text-gray-400 text-sm">Engagement flexible</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {monthlyPlan.price}€
                    </div>
                    <div className="text-sm text-gray-400">/mois</div>
                  </div>
                </div>
                
                <button
                  onClick={() => subscribeToPlan(monthlyPlan.stripePriceId)}
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Choisir ce plan'}
                </button>
              </motion.div>
            )}

            {/* Plan Annuel */}
            {yearlyPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-2 border-purple-500 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Badge Populaire */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  ÉCONOMISEZ 58€
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Annuel</h3>
                    <p className="text-gray-400 text-sm">2 mois offerts</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {yearlyPlan.price}€
                    </div>
                    <div className="text-sm text-gray-400">/an</div>
                    <div className="text-xs text-green-400 mt-1">
                      24€/mois
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => subscribeToPlan(yearlyPlan.stripePriceId)}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {loading ? 'Chargement...' : 'Meilleur choix'}
                </button>
              </motion.div>
            )}
          </div>

          {/* Période d'essai ou garantie */}
          <div className="mt-6 text-center">
            {!isInTrial ? (
              <button
                onClick={startTrial}
                className="text-purple-400 hover:text-purple-300 text-sm underline"
              >
                Essayer gratuitement 7 jours
              </button>
            ) : (
              <p className="text-green-400 text-sm">
                🎉 Période d'essai active - {trialDaysRemaining} jours restants
              </p>
            )}
            
            <p className="text-gray-500 text-xs mt-2">
              Annulation possible à tout moment • Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};