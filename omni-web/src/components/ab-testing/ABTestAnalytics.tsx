'use client';

import { useEffect, useRef } from 'react';
import { useABTestContext } from './ABTestProvider';
import { conversionGoals } from '@/lib/abTests';
import { trackEngagement } from '@/utils/analytics';

interface ABTestAnalyticsProps {
  children: React.ReactNode;
}

export function ABTestAnalytics({ children }: ABTestAnalyticsProps) {
  const { trackConversion } = useABTestContext();
  const timeOnPageRef = useRef<number>(Date.now());
  const scrollThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    
    // Track time on page
    const trackTimeOnPage = () => {
      const timeSpent = Math.floor((Date.now() - timeOnPageRef.current) / 1000);
      
      if (timeSpent >= 60 && !scrollThresholds.current.has(60)) {
        scrollThresholds.current.add(60);
        trackConversion('omniscan_hero_messaging', conversionGoals.TIME_ON_PAGE_60S);
        trackConversion('omniscan_cta_style', conversionGoals.TIME_ON_PAGE_60S);
        trackConversion('omniscan_pricing_display', conversionGoals.TIME_ON_PAGE_60S);
        trackConversion('omniscan_social_proof', conversionGoals.TIME_ON_PAGE_60S);
      }
      
      if (timeSpent >= 180 && !scrollThresholds.current.has(180)) {
        scrollThresholds.current.add(180);
        trackConversion('omniscan_hero_messaging', conversionGoals.TIME_ON_PAGE_180S);
        trackConversion('omniscan_cta_style', conversionGoals.TIME_ON_PAGE_180S);
        trackConversion('omniscan_pricing_display', conversionGoals.TIME_ON_PAGE_180S);
        trackConversion('omniscan_social_proof', conversionGoals.TIME_ON_PAGE_180S);
      }
    };

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;

      // Track 50% scroll
      if (scrollPercentage >= 50 && !scrollThresholds.current.has(50)) {
        scrollThresholds.current.add(50);
        trackConversion('omniscan_hero_messaging', conversionGoals.SCROLL_50);
        trackConversion('omniscan_cta_style', conversionGoals.SCROLL_50);
        trackConversion('omniscan_pricing_display', conversionGoals.SCROLL_50);
        trackConversion('omniscan_social_proof', conversionGoals.SCROLL_50);
        trackEngagement.scroll(50);
      }

      // Track 90% scroll
      if (scrollPercentage >= 90 && !scrollThresholds.current.has(90)) {
        scrollThresholds.current.add(90);
        trackConversion('omniscan_hero_messaging', conversionGoals.SCROLL_90);
        trackConversion('omniscan_cta_style', conversionGoals.SCROLL_90);
        trackConversion('omniscan_pricing_display', conversionGoals.SCROLL_90);
        trackConversion('omniscan_social_proof', conversionGoals.SCROLL_90);
        trackEngagement.scroll(90);
      }
    };

    // Set up timers and listeners
    const activeTimer = setInterval(trackTimeOnPage, 10000); // Check every 10 seconds
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(activeTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackConversion]);

  return <>{children}</>;
}