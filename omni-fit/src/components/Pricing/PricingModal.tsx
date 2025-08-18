import { Check, Zap, Users, Star } from 'lucide-react';
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user, plan } = useAuth();
  const plans = LEMONSQUEEZY_CONFIG.plans;

  const handleSubscribe = (planId: 'pro' | 'team') => {
    if (!user) {
      // Afficher la modal de connexion
      alert('Veuillez vous connecter pour souscrire à un plan');
      return;
    }

    // Redirection vers LemonSqueezy avec l'email pré-rempli
    const checkoutUrl = LEMONSQUEEZY_CONFIG.checkoutUrls[planId];
    if (checkoutUrl) {
      const url = new URL(checkoutUrl);
      url.searchParams.set('checkout[email]', user.email!);
      url.searchParams.set('checkout[custom][user_id]', user.id);
      window.open(url.toString(), '_blank');
    } else {
      alert('Configuration de paiement en cours...');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-200 mb-2">Choisissez votre plan</h2>
            <p className="text-gray-400">Débloquez tout le potentiel d'OmniFit</p>
          </div>

              {/* Plans */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div
                  className={`relative rounded-xl p-6 ${
                    plan === 'free' ? 'bg-gray-800 ring-2 ring-primary-400' : 'bg-gray-800/50'
                  }`}
                >
                  {plan === 'free' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Plan actuel
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-200 mb-2">{plans.free.name}</h3>
                    <div className="text-3xl font-bold text-gray-200">{plans.free.price}€</div>
                    <p className="text-gray-400 text-sm">Pour toujours</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plans.free.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled
                    className="w-full py-3 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    {plan === 'free' ? 'Plan actuel' : 'Gratuit'}
                  </button>
                </div>

                {/* Pro Plan */}
                <div
                  className={`relative rounded-xl p-6 ${
                    plan === 'pro'
                      ? 'bg-gray-800 ring-2 ring-primary-400'
                      : 'bg-gradient-to-b from-primary-900/20 to-gray-800'
                  }`}
                >
                  {/* Popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Populaire
                    </span>
                  </div>

                  {plan === 'pro' && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Actif
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-200 mb-2 flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5 text-primary-400" />
                      {plans.pro.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-200">
                      {plans.pro.price}€
                      <span className="text-lg font-normal text-gray-400">/mois</span>
                    </div>
                    <p className="text-gray-400 text-sm">Facturation mensuelle</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plans.pro.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe('pro')}
                    disabled={plan === 'pro'}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      plan === 'pro'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-400 to-secondary-400 text-white hover:opacity-90'
                    }`}
                  >
                    {plan === 'pro' ? 'Plan actuel' : 'Commencer'}
                  </button>
                </div>

                {/* Team Plan */}
                <div
                  className={`relative rounded-xl p-6 ${
                    plan === 'team' ? 'bg-gray-800 ring-2 ring-primary-400' : 'bg-gray-800/50'
                  }`}
                >
                  {plan === 'team' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Actif
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-200 mb-2 flex items-center justify-center gap-2">
                      <Users className="w-5 h-5 text-secondary-400" />
                      {plans.team.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-200">
                      {plans.team.price}€
                      <span className="text-lg font-normal text-gray-400">/mois</span>
                    </div>
                    <p className="text-gray-400 text-sm">Pour les équipes</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plans.team.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-secondary-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe('team')}
                    disabled={plan === 'team'}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      plan === 'team'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-secondary-600 text-white hover:bg-secondary-700'
                    }`}
                  >
                    {plan === 'team' ? 'Plan actuel' : 'Contactez-nous'}
                  </button>
                </div>
              </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              🔒 Paiement sécurisé par LemonSqueezy • Annulation à tout moment
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
