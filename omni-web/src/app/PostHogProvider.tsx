'use client';

import React, { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export function PostHogPageview(): React.ReactElement {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview');
    }
  }, []);
  return <></>;
}

export default function PHProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: 'identified_only',
          capture_pageview: false,
        });
      }
    }
  }, []);

  return <PostHogProvider client={posthog}>{children as any}</PostHogProvider>;
}
