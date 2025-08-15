'use client';

import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useMultipleABTests } from '@/hooks/useABTest';
import { testsByProduct } from '@/lib/abTests';

interface ABTestContextValue {
  results: Record<string, ReturnType<typeof useMultipleABTests>['results'][string]>;
  isLoading: boolean;
  trackConversion: (testId: string, conversionType: string) => void;
  getVariant: (testId: string) => string;
  isVariant: (testId: string, variantId: string) => boolean;
}

const ABTestContext = createContext<ABTestContextValue | null>(null);

interface ABTestProviderProps {
  children: ReactNode;
  product?: 'omniscan' | 'omnitask' | 'omnifit';
}

export function ABTestProvider({ children, product = 'omniscan' }: ABTestProviderProps) {
  const tests = useMemo(() => product ? testsByProduct[product] : [], [product]);
  const abTestResults = useMultipleABTests(tests);

  // Track page view with A/B test context
  useEffect(() => {
    if (!abTestResults.isLoading && typeof window !== 'undefined') {
      const activeVariants = tests.reduce((acc, test) => {
        const variant = abTestResults.getVariant(test.id);
        if (variant) {
          acc[test.id] = variant;
        }
        return acc;
      }, {} as Record<string, string>);

      // Track page view with A/B test context
      if (Object.keys(activeVariants).length > 0) {
        // This will be tracked via the existing analytics
        console.log('AB Test Context:', activeVariants);
      }
    }
  }, [abTestResults.isLoading, tests, abTestResults]);

  return (
    <ABTestContext.Provider value={abTestResults}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTestContext() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTestContext must be used within an ABTestProvider');
  }
  return context;
}

// Convenience hooks for specific tests
export function useOmniScanHeroTest() {
  const { results } = useABTestContext();
  return results['omniscan_hero_messaging'];
}

export function useOmniScanCtaTest() {
  const { results } = useABTestContext();
  return results['omniscan_cta_style'];
}

export function useOmniScanPricingTest() {
  const { results } = useABTestContext();
  return results['omniscan_pricing_display'];
}

export function useOmniScanSocialProofTest() {
  const { results } = useABTestContext();
  return results['omniscan_social_proof'];
}