'use client';

import Script from 'next/script';

interface UmamiProviderProps {
  websiteId: string;
  domain?: string;
  enabled?: boolean;
}

export default function UmamiProvider({
  websiteId,
  domain = 'https://analytics.omnirealm.tech',
  enabled = true,
}: UmamiProviderProps) {
  if (!enabled || !websiteId) {
    return null;
  }

  return (
    <Script
      async
      defer
      data-website-id={websiteId}
      src={`${domain}/script.js`}
      strategy="afterInteractive"
    />
  );
}