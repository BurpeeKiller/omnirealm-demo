import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { subscriptionService } from '../services/subscription';

export function SuccessPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le session_id depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Activer le statut premium
      subscriptionService.mockPremiumSubscription();
      
      // TODO: Dans une vraie app, on récupérerait les infos depuis le backend
      // const customerData = await apiService.getCustomerFromSession(sessionId);
      // localStorage.setItem('omnifit_stripe_customer_id', customerData.customerId);
    }

    // Rediriger après 3 secondes
    const timer = setTimeout(() => {
      setLoading(false);
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Bienvenue dans OmniFit Premium !
        </h1>

        <p className="text-gray-400 mb-8">
          Votre abonnement est maintenant actif. Vous avez accès à toutes les fonctionnalités premium.
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirection en cours...</span>
          </div>
        ) : (
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Accéder à l'application
          </button>
        )}
      </div>
    </div>
  );
}