'use client';

import Link from 'next/link';
import { useOmniScanHeroTest, useOmniScanCtaTest, useABTestContext } from './ABTestProvider';
import { conversionGoals } from '@/lib/abTests';

interface ABOptimizedHeroProps {
  onCtaClick?: () => void;
}

export function ABOptimizedHero({ onCtaClick }: ABOptimizedHeroProps) {
  const heroTest = useOmniScanHeroTest();
  const ctaTest = useOmniScanCtaTest();
  const { trackConversion } = useABTestContext();

  // Default values (fallback)
  const defaultConfig = {
    headline: 'OCR Intelligent avec IA',
    subheadline: 'Transformez instantanément vos documents papier, PDF et images en données structurées exploitables.',
    ctaPrimary: 'Essayer Gratuitement',
    ctaSecondary: 'Découvrir les fonctionnalités',
    primaryColor: 'bg-blue-600 hover:bg-blue-700',
    urgencyText: null
  };

  // Get configuration from A/B tests
  const heroConfig = heroTest?.config || {};
  const ctaConfig = ctaTest?.config || {};
  
  const config = {
    ...defaultConfig,
    ...heroConfig,
    ...ctaConfig
  };

  const handlePrimaryClick = () => {
    // Track conversion
    trackConversion('omniscan_hero_messaging', conversionGoals.CTA_CLICK);
    trackConversion('omniscan_cta_style', conversionGoals.CTA_CLICK);
    
    if (onCtaClick) {
      onCtaClick();
    }
  };

  const handleSecondaryClick = () => {
    trackConversion('omniscan_hero_messaging', conversionGoals.FEATURE_VIEW);
  };

  if (heroTest?.isLoading || ctaTest?.isLoading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  return (
    <section className="relative px-4 py-20 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <span className="mr-2">🚀</span> En Production
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              OmniScan
              <span className="block text-blue-600 dark:text-blue-400">
                {config.headline}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {config.subheadline}
            </p>
            
            {/* Urgency text for variant B */}
            {config.urgencyText && (
              <div className="inline-flex items-center rounded-lg bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
                {config.urgencyText}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://scan.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePrimaryClick}
                className={`inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 ${config.primaryColor}`}
              >
                {config.ctaPrimary}
              </a>
              <Link
                href="#features"
                onClick={handleSecondaryClick}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {config.ctaSecondary}
              </Link>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                5 scans gratuits/mois
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sans carte bancaire
              </span>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-2xl">
              <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="h-32 w-32 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}