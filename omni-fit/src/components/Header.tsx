import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OmniFitLogo } from '@/components/Branding/OmniFitLogo';
import { PremiumBadge } from '@/components/Premium';
import { Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeScreen } from '@/components/UpgradeScreen';

export function Header() {
  const [time, setTime] = useState(new Date());
  const [showUpgradeScreen, setShowUpgradeScreen] = useState(false);
  const { isPremium, isInTrial } = useSubscription();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4 px-4 flex items-center justify-between"
      >
      {/* Logo à gauche */}
      <div className="flex-1">
        <OmniFitLogo size="small" />
      </div>

      {/* Horloge au centre */}
      <div className="text-center flex-1">
        <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tabular-nums">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-400 mt-1 capitalize">
          {formatDate(time)}
        </div>
      </div>

      {/* Badge Premium ou bouton Upgrade à droite */}
      <div className="flex-1 flex justify-end">
        {isPremium || isInTrial ? (
          <PremiumBadge size="small" showText={false} />
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpgradeScreen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold shadow-lg hover:shadow-orange-500/25 transition-shadow"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade</span>
          </motion.button>
        )}
      </div>
      </motion.div>

      {/* Écran d'upgrade */}
      <UpgradeScreen 
        isOpen={showUpgradeScreen} 
        onClose={() => setShowUpgradeScreen(false)} 
      />
    </>
  );
}