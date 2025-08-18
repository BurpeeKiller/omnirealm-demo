import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Brain, Trophy, Shield } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/components/ui/adaptive-dialog';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export const UpgradePrompt = ({ isOpen, onClose, feature }: UpgradePromptProps) => {
  const { plans, subscribeToPlan, loading, isInTrial, trialDaysRemaining, startTrial } = useSubscription();

  const monthlyPlan = plans.find(p => p.interval === 'month');
  const yearlyPlan = plans.find(p => p.interval === 'year');

  const benefits = [
    { icon: Brain, text: 'Coach IA personnalisé', color: 'text-purple-400' },
    { icon: Zap, text: 'Programmes sur mesure', color: 'text-yellow-400' },
    { icon: Trophy, text: 'Challenges exclusifs', color: 'text-orange-400' },
    { icon: Shield, text: 'Support prioritaire', color: 'text-green-400' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Header Premium */}
        <DialogHeader
          gradient="from-purple-600 to-pink-600"
          icon={
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              <Crown className="w-12 h-12 text-yellow-300" />
            </motion.div>
          }
          subtitle={feature ? `Débloquez ${feature} et bien plus encore` : 'Transformez votre entraînement avec l\'IA'}
        >
          Passez à OmniFit Premium
        </DialogHeader>

        <DialogBody>
          {/* Bénéfices */}
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
                className="border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors"
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
                  {loading ? <Sparkles className="w-4 h-4 animate-spin mx-auto" /> : 'Choisir Mensuel'}
                </button>
              </motion.div>
            )}

            {/* Plan Annuel */}
            {yearlyPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-2 border-purple-500 rounded-lg p-6 relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  2 mois offerts
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Annuel</h3>
                    <p className="text-gray-400 text-sm">Meilleure valeur</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {Math.round(yearlyPlan.price / 12)}€
                    </div>
                    <div className="text-sm text-gray-400">/mois</div>
                    <div className="text-xs text-gray-500 line-through">
                      {monthlyPlan ? `${monthlyPlan.price * 12}€/an` : ''}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => subscribeToPlan(yearlyPlan.stripePriceId)}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? <Sparkles className="w-4 h-4 animate-spin mx-auto" /> : 'Économiser avec Annuel'}
                </button>
              </motion.div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="text-center w-full">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};