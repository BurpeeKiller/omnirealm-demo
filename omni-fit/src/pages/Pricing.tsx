import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, ChevronLeft } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from '@/hooks/useNavigate';
import { PRICING_PLANS } from '@/services/subscription';

export function Pricing() {
  const { subscribeToPlan, isPremium, loading } = useSubscription();
  const navigate = useNavigate();
  
  const features = {
    free: [
      '3 exercices de base',
      'Suivi quotidien',
      'Statistiques simples',
      'Rappels personnalisés',
      'Mode hors ligne'
    ],
    premium: [
      'Tous les exercices débloqués',
      'Coach IA personnalisé',
      'Programmes d\'entraînement',
      'Analytics avancées',
      'Export des données',
      'Support prioritaire',
      'Nouvelles fonctionnalités en avant-première'
    ]
  };

  const monthlyPlan = PRICING_PLANS.find(p => p.interval === 'month');
  const yearlyPlan = PRICING_PLANS.find(p => p.interval === 'year');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/95 bg-opacity-95 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <h1 className="text-xl font-bold text-white">Tarifs</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-400">
            Débloquez tout le potentiel d'OmniFit avec Premium
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Plan Gratuit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-8 border border-gray-700"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Gratuit</h3>
              <div className="text-4xl font-bold text-white mb-2">0€</div>
              <p className="text-gray-400">Pour toujours</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              disabled
              className="w-full py-3 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              Plan actuel
            </button>
          </motion.div>

          {/* Plan Mensuel */}
          {monthlyPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-8 border-2 border-purple-600 relative"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {monthlyPlan.price}€
                  <span className="text-lg font-normal text-gray-400">/mois</span>
                </div>
                <p className="text-gray-400">Engagement flexible</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {features.premium.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => subscribeToPlan(monthlyPlan.stripePriceId)}
                disabled={loading || isPremium}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isPremium ? 'Déjà abonné' : loading ? 'Chargement...' : 'Commencer'}
              </button>
            </motion.div>
          )}

          {/* Plan Annuel */}
          {yearlyPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-8 border-2 border-purple-500 relative overflow-hidden"
            >
              {/* Badge Populaire */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-bl-xl">
                2 MOIS OFFERTS
              </div>
              
              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  Premium Annuel
                  <Crown className="w-6 h-6 text-yellow-400" />
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {yearlyPlan.price}€
                  <span className="text-lg font-normal text-gray-400">/an</span>
                </div>
                <p className="text-green-400 font-medium">
                  Économisez 58€ (24€/mois)
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => subscribeToPlan(yearlyPlan.stripePriceId)}
                disabled={loading || isPremium}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {isPremium ? 'Déjà abonné' : loading ? 'Chargement...' : 'Meilleur choix'}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Questions fréquentes
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Puis-je annuler à tout moment ?
              </h4>
              <p className="text-gray-400">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres. 
                Vous conserverez l'accès Premium jusqu'à la fin de votre période de facturation.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Y a-t-il une période d'essai ?
              </h4>
              <p className="text-gray-400">
                Oui, nous offrons 7 jours d'essai gratuit pour découvrir toutes les 
                fonctionnalités Premium sans engagement.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Comment fonctionne le paiement ?
              </h4>
              <p className="text-gray-400">
                Les paiements sont sécurisés et gérés par Stripe. Nous acceptons toutes 
                les cartes bancaires principales. Vos données de paiement ne sont jamais 
                stockées sur nos serveurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-12 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400">
            Des questions ? Contactez-nous à{' '}
            <a href="mailto:support@omnirealm.tech" className="text-purple-400 hover:text-purple-300">
              support@omnirealm.tech
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}