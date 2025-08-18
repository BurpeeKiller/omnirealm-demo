import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OmniFitLogo } from '@/components/Branding/OmniFitLogo';
import { Crown, Sparkles, LogIn, User } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeScreen } from '@/components/UpgradeScreenShadcn';
import { LoginModal } from '@/components/Auth/LoginModalShadcn';
import { useAuth } from '@/hooks/useAuth';
import { DebugSubscriptionCompact } from '@/components/DebugSubscriptionCompact';

export function Header() {
  const [time, setTime] = useState(new Date());
  const [showUpgradeScreen, setShowUpgradeScreen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isPremium, isInTrial } = useSubscription();
  const { user, isAuthenticated, signOut } = useAuth();

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
        className="py-2 sm:py-4 px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2"
      >
      {/* Logo à gauche */}
      <div className="flex-1 w-full sm:w-auto flex justify-center sm:justify-start">
        <OmniFitLogo size="small" />
      </div>

      {/* Horloge au centre */}
      <div className="text-center flex-1 w-full sm:w-auto">
        <div className="text-3xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tabular-nums">
          {formatTime(time)}
        </div>
        <div className="text-base lg:text-lg text-gray-400 mt-2 capitalize">
          {formatDate(time)}
        </div>
      </div>

      {/* Statut Premium et connexion à droite */}
      <div className="flex-1 w-full sm:w-auto flex justify-center sm:justify-end items-center gap-2 sm:gap-3">
        {/* Debug Subscription (dev only) */}
        <DebugSubscriptionCompact />
        
        {/* Statut Premium */}
        {(isPremium || isInTrial) && (
          <div className="flex items-center gap-2 text-base lg:text-lg whitespace-nowrap px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            {isPremium ? (
              <>
                <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                <span className="text-purple-400 font-medium">Premium</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                <span className="text-green-400 font-medium">Essai - {isInTrial ? '7j' : '0j'}</span>
              </>
            )}
          </div>
        )}
        
        {/* Bouton connexion/profil */}
        {isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <User className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-base lg:text-lg hidden sm:inline">{user?.email?.split('@')[0]}</span>
            </button>
            {/* Menu dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-3 text-left text-base lg:text-lg text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Déconnexion
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-white rounded-lg hover:opacity-90 transition-opacity text-base lg:text-lg"
          >
            <LogIn className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-base lg:text-lg hidden sm:inline">Connexion</span>
          </button>
        )}
      </div>
      </motion.div>

      {/* Écran d'upgrade */}
      <UpgradeScreen 
        isOpen={showUpgradeScreen} 
        onClose={() => setShowUpgradeScreen(false)} 
      />
      
      {/* Modal de connexion */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}