import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscription';
import { isDevelopment } from '@/lib/config';
import { Bug } from 'lucide-react';

export function DebugSubscriptionCompact() {
  const { isPremium, isInTrial, subscriptionStatus } = useSubscription();
  const [showMenu, setShowMenu] = useState(false);

  const resetToFree = () => {
    subscriptionService.resetSubscription();
    window.location.reload();
  };

  const startTrial = () => {
    subscriptionService.startFreeTrial();
    window.location.reload();
  };

  const mockPremium = () => {
    subscriptionService.mockPremiumSubscription();
    window.location.reload();
  };

  // Afficher seulement en développement
  if (!isDevelopment) return null;

  return (
    <div className="relative">
      {/* Bouton debug */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
        title="Debug Subscription"
      >
        <Bug className="w-4 h-4 text-yellow-400" />
        <span className="hidden sm:inline text-xs">
          {subscriptionStatus.type === 'premium' ? 'Premium' : 
           subscriptionStatus.type === 'trial' ? 'Trial' : 'Free'}
        </span>
      </button>

      {/* Menu dropdown */}
      {showMenu && (
        <>
          {/* Backdrop pour fermer le menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50">
            <h3 className="font-bold mb-3 text-sm">Debug Subscription</h3>
            
            <div className="space-y-1 mb-3 text-xs">
              <p className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-yellow-400">{subscriptionStatus.type}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">{subscriptionStatus.status}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Premium:</span>
                <span className={isPremium ? 'text-green-400' : 'text-red-400'}>
                  {isPremium ? 'Oui' : 'Non'}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Trial:</span>
                <span className={isInTrial ? 'text-green-400' : 'text-red-400'}>
                  {isInTrial ? 'Oui' : 'Non'}
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={resetToFree}
                className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-medium transition-colors"
              >
                Reset to Free
              </button>
              <button 
                onClick={startTrial}
                className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-medium transition-colors"
              >
                Start Trial
              </button>
              <button 
                onClick={mockPremium}
                className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-medium transition-colors"
              >
                Mock Premium
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}