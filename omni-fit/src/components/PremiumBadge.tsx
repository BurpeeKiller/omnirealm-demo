import { Crown } from 'lucide-react';
import { subscriptionService } from '../services/subscription';

export function PremiumBadge() {
  const isPremium = subscriptionService.isPremium();
  const isInTrial = subscriptionService.isInTrial();
  const trialDays = subscriptionService.getTrialDaysRemaining();

  if (!isPremium && !isInTrial) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
      <Crown className="w-3 h-3" />
      <span>
        {isPremium ? 'Premium' : `Essai (${trialDays}j restants)`}
      </span>
    </div>
  );
}