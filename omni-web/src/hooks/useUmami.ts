'use client';

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Hook helper pour tracker des events custom avec Umami
 */
export function useUmami() {
  const trackEvent = (
    eventName: string, 
    eventData?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(eventName, eventData);
    }
  };

  // Events prédéfinis pour OmniRealm
  const trackConversion = (type: 'signup' | 'trial' | 'purchase' | 'contact') => {
    trackEvent('Conversion', { type });
  };

  const trackEngagement = (action: string, category?: string) => {
    trackEvent('Engagement', { action, category });
  };

  const trackError = (error: string, context?: string) => {
    trackEvent('Error', { error, context });
  };

  return {
    trackEvent,
    trackConversion,
    trackEngagement,
    trackError
  };
}