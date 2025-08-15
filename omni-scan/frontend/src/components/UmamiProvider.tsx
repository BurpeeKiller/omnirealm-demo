'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (enabled && window.umami) {
      // Umami automatically tracks pageviews, no need for manual tracking
    }
  }, [pathname, enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        async
        defer
        data-website-id={websiteId}
        src={`${domain}/script.js`}
        strategy="afterInteractive"
      />
      {children}
    </>
  );
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