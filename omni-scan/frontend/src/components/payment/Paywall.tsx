import { useState } from 'react';
import { X, Lock, CheckCircle, Zap } from 'lucide-react';
import { createCheckoutSession } from '@/services/api-simple';
import { useUmami } from '@/components/UmamiProvider';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  scansUsed: number;
  scansLimit: number;
}

export function Paywall({ isOpen, onClose, scansUsed, scansLimit }: PaywallProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useUmami();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createCheckoutSession();
      
      if (response.url) {
        // Rediriger vers Stripe Checkout
        trackEvent('Conversion', { type: 'trial' }); // Track trial start
        window.location.href = response.url;
      } else if (response.message) {
        // Mode demo
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Limite atteinte
          </h2>
          
          <p className="text-gray-600">
            Vous avez utilisé {scansUsed} scans sur {scansLimit} gratuits ce mois-ci.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Passez à OmniScan Pro
          </h3>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Scans illimités chaque mois</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Analyse IA avancée avec GPT-4</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Export illimité (PDF, Excel, JSON)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Traitement batch jusqu'à 100 fichiers</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Support prioritaire</span>
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            49€ <span className="text-lg font-normal text-gray-600">/mois</span>
          </div>
          <p className="text-sm text-gray-500">
            Annulation possible à tout moment
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Passer à Pro</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Paiement sécurisé par Stripe. Vos données sont protégées.
        </p>
      </div>
    </div>
  );
}