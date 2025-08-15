'use client';

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useCookieConsent } from '@/components/legal/useCookieConsent';

export function PostHogPageview(): React.ReactElement {
  const { hasAnalyticsConsent } = useCookieConsent();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && hasAnalyticsConsent()) {
      posthog.capture('$pageview');
    }
  }, [hasAnalyticsConsent]);
  
  return <></>;
}

export default function PHProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { consent, isLoading } = useCookieConsent();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (consent?.analytics && posthogKey && posthogHost && !isInitialized) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: 'identified_only',
          capture_pageview: false,
        });
        setIsInitialized(true);
      } else if (!consent?.analytics && isInitialized) {
        // Si le consentement est retiré, désactiver PostHog
        posthog.opt_out_capturing();
        setIsInitialized(false);
      }
    }
  }, [consent, isLoading, isInitialized]);

  // Si pas de consentement, on retourne juste les enfants sans le provider
  if (!consent?.analytics) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children as any}</PostHogProvider>;
}