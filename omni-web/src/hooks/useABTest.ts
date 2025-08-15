import { useState, useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';
import { useCookieConsent } from '@/components/legal/useCookieConsent';

export interface ABVariant {
  id: string;
  name: string;
  weight: number; // Weight for distribution (0-100)
  config?: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface ABTestStorage {
  variant: string;
  testId: string;
  assignedAt: number;
  exposed: boolean; // Whether user has been exposed to the test
}

const STORAGE_KEY = 'ab-test-assignments';
const EXPOSURE_THRESHOLD = 1000; // 1 second to consider user as exposed

class ABTestManager {
  private static instance: ABTestManager;
  private assignments: Map<string, ABTestStorage> = new Map();
  private initialized = false;

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager();
    }
    return ABTestManager.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadAssignments();
    }
  }

  private loadAssignments(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.assignments = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load AB test assignments:', error);
    }
    this.initialized = true;
  }

  private saveAssignments(): void {
    try {
      const data = Object.fromEntries(this.assignments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save AB test assignments:', error);
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getUserId(): string {
    // Generate a consistent user ID for assignment
    let userId = localStorage.getItem('ab-user-id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab-user-id', userId);
    }
    return userId;
  }

  private selectVariant(test: ABTest): ABVariant {
    const userId = this.getUserId();
    const seed = this.hashString(`${test.id}-${userId}`);
    const random = (seed % 10000) / 10000; // Normalize to 0-1

    let cumulativeWeight = 0;
    const totalWeight = test.variants.reduce((sum, variant) => sum + variant.weight, 0);

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight / totalWeight) {
        return variant;
      }
    }

    // Fallback to first variant
    return test.variants[0];
  }

  assignVariant(test: ABTest): string {
    if (!this.initialized) {
      this.loadAssignments();
    }

    // Check if test is enabled and within date range
    if (!test.enabled) {
      return test.variants[0]?.id || 'control';
    }

    const now = Date.now();
    if (test.startDate && now < test.startDate.getTime()) {
      return test.variants[0]?.id || 'control';
    }
    if (test.endDate && now > test.endDate.getTime()) {
      return test.variants[0]?.id || 'control';
    }

    // Check if user already has an assignment
    const existing = this.assignments.get(test.id);
    if (existing) {
      // Validate that the variant still exists in the test
      const variantExists = test.variants.some(v => v.id === existing.variant);
      if (variantExists) {
        return existing.variant;
      }
    }

    // Assign new variant
    const selectedVariant = this.selectVariant(test);
    const assignment: ABTestStorage = {
      variant: selectedVariant.id,
      testId: test.id,
      assignedAt: now,
      exposed: false
    };

    this.assignments.set(test.id, assignment);
    this.saveAssignments();

    return selectedVariant.id;
  }

  trackExposure(testId: string, variantId: string, hasAnalyticsConsent: boolean): void {
    if (!hasAnalyticsConsent) return;

    const assignment = this.assignments.get(testId);
    if (!assignment || assignment.exposed) return;

    // Mark as exposed after threshold
    setTimeout(() => {
      assignment.exposed = true;
      this.assignments.set(testId, assignment);
      this.saveAssignments();

      // Track exposure event
      trackEvent('AB Test: Exposure', {
        test_id: testId,
        variant: variantId,
        user_id: this.getUserId()
      });
    }, EXPOSURE_THRESHOLD);
  }

  trackConversion(testId: string, conversionType: string, hasAnalyticsConsent: boolean): void {
    if (!hasAnalyticsConsent) return;

    const assignment = this.assignments.get(testId);
    if (!assignment || !assignment.exposed) return;

    trackEvent('AB Test: Conversion', {
      test_id: testId,
      variant: assignment.variant,
      conversion_type: conversionType,
      user_id: this.getUserId()
    });
  }

  getAssignment(testId: string): ABTestStorage | undefined {
    return this.assignments.get(testId);
  }

  clearAssignments(): void {
    this.assignments.clear();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ab-user-id');
  }
}

/**
 * Hook for A/B testing
 * @param test - The A/B test configuration
 * @returns Object with variant, config, and tracking functions
 */
export function useABTest(test: ABTest) {
  const [variant, setVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { hasAnalyticsConsent } = useCookieConsent();
  
  const manager = ABTestManager.getInstance();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const assignedVariant = manager.assignVariant(test);
    setVariant(assignedVariant);
    setIsLoading(false);

    // Track exposure
    manager.trackExposure(test.id, assignedVariant, hasAnalyticsConsent());
  }, [test, hasAnalyticsConsent, manager]);

  const trackConversion = (conversionType: string) => {
    manager.trackConversion(test.id, conversionType, hasAnalyticsConsent());
  };

  const getVariantConfig = () => {
    const variantData = test.variants.find(v => v.id === variant);
    return variantData?.config || {};
  };

  return {
    variant,
    isVariant: (variantId: string) => variant === variantId,
    isLoading,
    trackConversion,
    config: getVariantConfig(),
    variantName: test.variants.find(v => v.id === variant)?.name || 'Unknown'
  };
}

/**
 * Hook for managing multiple A/B tests
 * @param tests - Array of A/B tests
 * @returns Object with test results and management functions
 */
export function useMultipleABTests(tests: ABTest[]) {
  // Create individual results based on the tests array length
  const results: Record<string, ReturnType<typeof useABTest>> = {};
  
  // Call useABTest for each test (fixed number of hook calls)
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[test.id] = useABTest(test);
  }

  const isLoading = Object.values(results).some(r => r.isLoading);

  const trackConversion = (testId: string, conversionType: string) => {
    const result = results[testId];
    if (result) {
      result.trackConversion(conversionType);
    }
  };

  return {
    results,
    isLoading,
    trackConversion,
    getVariant: (testId: string) => results[testId]?.variant || '',
    isVariant: (testId: string, variantId: string) => results[testId]?.isVariant(variantId) || false
  };
}

export { ABTestManager };