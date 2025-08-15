'use client';

import Link from 'next/link';
import { useOmniScanPricingTest, useABTestContext } from './ABTestProvider';
import { conversionGoals } from '@/lib/abTests';

export function ABOptimizedPricing() {
  const pricingTest = useOmniScanPricingTest();
  const { trackConversion } = useABTestContext();

  // Default configuration
  const defaultConfig = {
    showDiscount: false,
    priceDisplay: 'monthly',
    urgencyBanner: null,
    popularBadge: 'POPULAIRE',
    discountPrice: '34€',
    originalPrice: '49€'
  };

  const config = { ...defaultConfig, ...pricingTest?.config };

  const handlePricingView = () => {
    trackConversion('omniscan_pricing_display', conversionGoals.PRICING_VIEW);
  };

  const handleSubscriptionClick = (_plan: string) => {
    trackConversion('omniscan_pricing_display', conversionGoals.SUBSCRIPTION);
  };

  if (pricingTest?.isLoading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  return (
    <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50" onLoad={handlePricingView}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tarification Simple et Transparente
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Commencez gratuitement, évoluez selon vos besoins
          </p>
        </div>

        {/* Urgency Banner for Variant A */}
        {config.urgencyBanner && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-6 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
              {config.urgencyBanner}
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Pour découvrir OmniScan</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">0€</span>
              <span className="text-gray-600 dark:text-gray-400">/mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>5 scans par mois</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Export JSON/CSV</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Stockage 7 jours</span>
              </li>
            </ul>
            <a
              href="https://scan.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSubscriptionClick('free')}
              className="block w-full text-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Commencer
            </a>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-xl text-white relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold">
              {config.popularBadge}
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-blue-100 mb-6">Pour les professionnels</p>
            <div className="mb-6">
              {config.showDiscount ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold">{config.discountPrice}</span>
                    <span className="text-blue-100">/mois</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    <span className="line-through">{config.originalPrice}/mois</span>
                    <span className="ml-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">-30%</span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-4xl font-bold">49€</span>
                  <span className="text-blue-100">/mois</span>
                </div>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Scans illimités</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Export tous formats + API</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Stockage illimité</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Templates personnalisés</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Support prioritaire</span>
              </li>
            </ul>
            <a
              href="https://scan.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSubscriptionClick('pro')}
              className="block w-full text-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow transition-all hover:bg-gray-50"
            >
              {config.showDiscount ? 'Profiter de l\'offre' : 'Essayer 14 jours gratuits'}
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Entreprise</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Solutions sur-mesure</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Sur devis</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Tout du plan Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Déploiement on-premise</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>SLA garantis</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Formation équipes</span>
              </li>
            </ul>
            <Link
              href="/contact"
              onClick={() => handleSubscriptionClick('enterprise')}
              className="block w-full text-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}