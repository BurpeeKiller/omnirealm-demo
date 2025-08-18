import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscription';
import { isDevelopment } from '@/lib/config';

export function DebugSubscription() {
  const { isPremium, isInTrial, subscriptionStatus } = useSubscription();

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
    <div className="fixed bottom-20 right-4 bg-gray-800 p-4 rounded-lg shadow-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Debug Subscription</h3>
      <div className="space-y-1 mb-3">
        <p>Type: <span className="text-yellow-400">{subscriptionStatus.type}</span></p>
        <p>Status: <span className="text-green-400">{subscriptionStatus.status}</span></p>
        <p>Premium: <span className={isPremium ? 'text-green-400' : 'text-red-400'}>{isPremium ? 'Oui' : 'Non'}</span></p>
        <p>Trial: <span className={isInTrial ? 'text-green-400' : 'text-red-400'}>{isInTrial ? 'Oui' : 'Non'}</span></p>
      </div>
      <div className="space-y-2">
        <button 
          onClick={resetToFree}
          className="w-full px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Reset to Free
        </button>
        <button 
          onClick={startTrial}
          className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Start Trial
        </button>
        <button 
          onClick={mockPremium}
          className="w-full px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Mock Premium
        </button>
      </div>
    </div>
  );
}