'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

interface PlausibleProviderProps {
  domain: string;
  enabled?: boolean;
  selfHosted?: string; // URL du serveur Plausible self-hosted
  children: React.ReactNode;
}

export function PlausibleProvider({ 
  domain, 
  enabled = true,
  selfHosted,
  children 
}: PlausibleProviderProps) {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (enabled && window.plausible) {
      window.plausible('pageview');
    }
  }, [pathname, enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  const scriptSrc = selfHosted 
    ? `${selfHosted}/js/script.js`
    : 'https://plausible.io/js/script.js';

  return (
    <>
      <Script
        defer
        data-domain={domain}
        src={scriptSrc}
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}

// Hook helper pour tracker des events custom
export function usePlausible() {
  const trackEvent = (
    eventName: string, 
    props?: Record<string, any>
  ) => {
    if (window.plausible) {
      window.plausible(eventName, { props });
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
interface PlausibleGoalProps {
  goal: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function PlausibleGoal({ goal, onClick, children, className }: PlausibleGoalProps) {
  const { trackEvent } = usePlausible();

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