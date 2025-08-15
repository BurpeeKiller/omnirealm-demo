import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cookie consent', e);
      }
    }
    setIsLoading(false);
  }, []);

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    if (!consent) return false;
    return consent[type] === true;
  };

  const updateConsent = (newConsent: CookiePreferences) => {
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const resetConsent = () => {
    setConsent(null);
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    window.location.reload(); // Pour réafficher la bannière
  };

  return {
    consent,
    isLoading,
    hasConsent,
    updateConsent,
    resetConsent,
    hasAnalyticsConsent: () => hasConsent('analytics'),
    hasMarketingConsent: () => hasConsent('marketing'),
    hasPreferencesConsent: () => hasConsent('preferences'),
  };
}