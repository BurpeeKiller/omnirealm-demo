import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
}

export const PremiumBadge = ({ size = 'medium', showText = true, onClick }: PremiumBadgeProps) => {
  const { isPremium, isInTrial, trialDaysRemaining } = useSubscription();

  if (!isPremium && !isInTrial) return null;

  const sizes = {
    small: { icon: 16, text: 'text-xs', padding: 'px-2 py-1' },
    medium: { icon: 20, text: 'text-sm', padding: 'px-3 py-1.5' },
    large: { icon: 24, text: 'text-base', padding: 'px-4 py-2' }
  };

  const currentSize = sizes[size];

  return (
    <motion.button
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${isPremium 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
          : 'bg-gradient-to-r from-green-600 to-blue-600'
        }
        text-white font-semibold shadow-lg
        ${currentSize.padding} ${currentSize.text}
        cursor-pointer transition-all
      `}
    >
      {isPremium ? (
        <>
          <Crown className={`w-${currentSize.icon} h-${currentSize.icon}`} />
          {showText && <span>Premium</span>}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className={`w-${currentSize.icon - 4} h-${currentSize.icon - 4}`} />
          </motion.div>
        </>
      ) : (
        <>
          <Sparkles className={`w-${currentSize.icon} h-${currentSize.icon}`} />
          {showText && <span>Essai - {trialDaysRemaining}j</span>}
        </>
      )}
    </motion.button>
  );
};