import { useEffect } from 'react';

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

interface UmamiProviderProps {
  websiteId: string;
  enabled?: boolean;
  domain?: string;
  children: React.ReactNode;
}

export function UmamiProvider({ 
  websiteId, 
  enabled = true,
  domain = 'https://analytics.omnirealm.tech',
  children 
}: UmamiProviderProps) {
  // Track page views on route change
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      // Inject Umami script dynamically
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.setAttribute('data-website-id', websiteId);
      script.src = `${domain}/script.js`;
      document.head.appendChild(script);
      
      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector(`script[data-website-id="${websiteId}"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [websiteId, enabled, domain]);

  if (!enabled) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

// Hook helper pour tracker des events custom
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

// Composant pour tracker les goals/conversions
interface UmamiGoalProps {
  goal: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function UmamiGoal({ goal, onClick, children, className }: UmamiGoalProps) {
  const { trackEvent } = useUmami();

  const handleClick = () => {
    trackEvent(goal);
    onClick?.();
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}