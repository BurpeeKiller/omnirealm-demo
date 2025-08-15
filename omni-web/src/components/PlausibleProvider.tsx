'use client';

import Script from 'next/script';

interface PlausibleProviderProps {
  domain?: string;
  customDomain?: string;
  enabled?: boolean;
}

export default function PlausibleProvider({
  domain = 'omnirealm.tech',
  customDomain,
  enabled = true,
}: PlausibleProviderProps) {
  if (!enabled || !domain) {
    return null;
  }

  const scriptSrc = customDomain
    ? `https://${customDomain}/js/script.js`
    : 'https://plausible.io/js/script.js';

  return <Script defer data-domain={domain} src={scriptSrc} strategy="afterInteractive" />;
}
