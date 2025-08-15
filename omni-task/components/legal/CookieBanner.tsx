'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieBannerProps {
  companyName?: string;
  privacyPolicyUrl?: string;
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
}

export default function CookieBanner({ 
  companyName = "OmniRealm",
  privacyPolicyUrl = "/privacy-policy",
  onAccept,
  onDecline 
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    savePreferences(allAccepted);
    onAccept?.(allAccepted);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    onAccept?.(preferences);
  };

  const handleDeclineAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    savePreferences(essentialOnly);
    onDecline?.();
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🍪 Nous utilisons des cookies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {companyName} utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. 
              En continuant, vous acceptez notre utilisation des cookies conformément à notre{' '}
              <a href={privacyPolicyUrl} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                politique de confidentialité
              </a>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleDeclineAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Refuser tout
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Personnaliser
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Accepter tout
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Personnaliser les cookies
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookies essentiels
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nécessaires au fonctionnement du site (toujours activés)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                  className="h-4 w-4 text-blue-600 rounded cursor-not-allowed opacity-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookies analytiques
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nous aident à comprendre comment vous utilisez le site
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookies marketing
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Utilisés pour vous proposer des publicités pertinentes
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookies de préférences
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permettent de sauvegarder vos préférences (langue, région)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sauvegarder mes préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}