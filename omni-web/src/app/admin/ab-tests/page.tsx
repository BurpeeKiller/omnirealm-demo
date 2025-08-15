'use client';

import React, { useState, useEffect } from 'react';
import { ABTestManager } from '@/hooks/useABTest';
import { activeTests, conversionGoals } from '@/lib/abTests';

interface TestResult {
  testId: string;
  testName: string;
  variants: {
    id: string;
    name: string;
    exposures: number;
    conversions: Record<string, number>;
    conversionRate: number;
  }[];
}

export default function ABTestDashboard() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedGoal, setSelectedGoal] = useState(conversionGoals.CTA_CLICK);

  // Simulate loading A/B test results (in real app, this would come from analytics)
  useEffect(() => {
    const mockResults: TestResult[] = activeTests.map(test => ({
      testId: test.id,
      testName: test.name,
      variants: test.variants.map(variant => {
        const baseExposures = Math.floor(Math.random() * 1000) + 100;
        const baseConversions = Math.floor(baseExposures * (Math.random() * 0.1 + 0.02));
        
        return {
          id: variant.id,
          name: variant.name,
          exposures: baseExposures,
          conversions: {
            [conversionGoals.CTA_CLICK]: Math.floor(baseConversions * 0.8),
            [conversionGoals.SIGNUP]: Math.floor(baseConversions * 0.3),
            [conversionGoals.SUBSCRIPTION]: Math.floor(baseConversions * 0.1),
            [conversionGoals.PRICING_VIEW]: Math.floor(baseConversions * 1.2),
          },
          conversionRate: baseConversions / baseExposures
        };
      })
    }));
    
    setResults(mockResults);
  }, []);

  const clearAllTests = () => {
    if (confirm('Are you sure you want to clear all A/B test data?')) {
      ABTestManager.getInstance().clearAssignments();
      window.location.reload();
    }
  };

  const getWinningVariant = (variants: TestResult['variants']) => {
    return variants.reduce((best, current) => 
      current.conversions[selectedGoal] / current.exposures > best.conversions[selectedGoal] / best.exposures 
        ? current 
        : best
    );
  };

  const calculateStatisticalSignificance = (variantA: any, variantB: any) => {
    // Simplified chi-square test
    const rateA = variantA.conversions[selectedGoal] / variantA.exposures;
    const rateB = variantB.conversions[selectedGoal] / variantB.exposures;
    const pooledRate = (variantA.conversions[selectedGoal] + variantB.conversions[selectedGoal]) / 
                      (variantA.exposures + variantB.exposures);
    
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/variantA.exposures + 1/variantB.exposures));
    const zScore = Math.abs(rateA - rateB) / se;
    
    // Simplified p-value approximation
    return zScore > 1.96 ? '< 0.05' : '> 0.05';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            A/B Tests Dashboard
          </h1>
          <div className="flex gap-4 items-center">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={conversionGoals.CTA_CLICK}>CTA Clicks</option>
              <option value={conversionGoals.SIGNUP}>Signups</option>
              <option value={conversionGoals.SUBSCRIPTION}>Subscriptions</option>
              <option value={conversionGoals.PRICING_VIEW}>Pricing Views</option>
            </select>
            <button
              onClick={clearAllTests}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {results.map((testResult) => {
            const winningVariant = getWinningVariant(testResult.variants);
            
            return (
              <div key={testResult.testId} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {testResult.testName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Test ID: {testResult.testId}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {testResult.variants.map((variant, index) => {
                    const conversionRate = variant.conversions[selectedGoal] / variant.exposures;
                    const isWinner = variant.id === winningVariant.id;
                    
                    return (
                      <div 
                        key={variant.id}
                        className={`p-4 rounded-lg border-2 ${
                          isWinner 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {variant.name}
                          </h3>
                          {isWinner && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-xs font-semibold">
                              WINNER
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Exposures:</span>
                            <span className="font-medium">{variant.exposures}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Conversions:</span>
                            <span className="font-medium">{variant.conversions[selectedGoal]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Rate:</span>
                            <span className="font-bold text-lg">
                              {(conversionRate * 100).toFixed(2)}%
                            </span>
                          </div>
                          
                          {/* Confidence interval */}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              vs Control: {index > 0 ? calculateStatisticalSignificance(testResult.variants[0], variant) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Test Summary */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Test Summary
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Exposures:</span>
                      <div className="font-bold">
                        {testResult.variants.reduce((sum, v) => sum + v.exposures, 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Conversions:</span>
                      <div className="font-bold">
                        {testResult.variants.reduce((sum, v) => sum + v.conversions[selectedGoal], 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Best Performance:</span>
                      <div className="font-bold text-green-600">
                        {winningVariant.name}: {((winningVariant.conversions[selectedGoal] / winningVariant.exposures) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Comment utiliser ce dashboard
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• Sélectionnez différents objectifs de conversion dans le menu déroulant</li>
            <li>• Les variants gagnants sont automatiquement marqués en vert</li>
            <li>• La signification statistique est calculée par rapport au variant de contrôle</li>
            <li>• Utilisez "Clear All Data" pour réinitialiser toutes les assignations de tests</li>
            <li>• Les données sont simulées dans cette démo - intégrez avec Plausible pour des données réelles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}