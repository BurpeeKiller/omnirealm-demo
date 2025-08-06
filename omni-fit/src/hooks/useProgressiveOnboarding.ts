import { useState, useEffect } from 'react';

interface OnboardingState {
  completed: boolean;
  completedSteps: string[];
  version: number;
  timestamp: number;
}

const STORAGE_KEY = 'fitness-reminder-onboarding-v2';
const ONBOARDING_VERSION = 2;

export const useProgressiveOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    completed: false,
    completedSteps: [],
    version: ONBOARDING_VERSION,
    timestamp: Date.now(),
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Charger l'état au montage
  useEffect(() => {
    loadState();
  }, []);

  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);

        // Vérifier si c'est la bonne version
        if (parsedState.version === ONBOARDING_VERSION) {
          setState(parsedState);
          setShowOnboarding(!parsedState.completed);
        } else {
          // Nouvelle version, remettre à zéro
          reset();
        }
      } else {
        // Première visite
        setShowOnboarding(true);
      }
    } catch (error) {
      console.warn('Failed to load onboarding state:', error);
      reset();
    }
  };

  const saveState = (newState: OnboardingState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
  };

  const complete = (completedSteps: string[] = []) => {
    const newState: OnboardingState = {
      completed: true,
      completedSteps,
      version: ONBOARDING_VERSION,
      timestamp: Date.now(),
    };
    saveState(newState);
    setShowOnboarding(false);
  };

  const reset = () => {
    const newState: OnboardingState = {
      completed: false,
      completedSteps: [],
      version: ONBOARDING_VERSION,
      timestamp: Date.now(),
    };
    saveState(newState);
    setShowOnboarding(true);
  };

  const skip = () => {
    const newState: OnboardingState = {
      completed: true,
      completedSteps: ['skipped'],
      version: ONBOARDING_VERSION,
      timestamp: Date.now(),
    };
    saveState(newState);
    setShowOnboarding(false);
  };

  const shouldShow = () => {
    // Montrer si pas complété et première visite ou demande explicite
    return !state.completed || showOnboarding;
  };

  return {
    state,
    shouldShow: shouldShow(),
    showOnboarding,
    setShowOnboarding,
    complete,
    reset,
    skip,

    // Helpers
    isFirstVisit: state.completedSteps.length === 0,
    hasCompletedStep: (stepId: string) => state.completedSteps.includes(stepId),
    completionRate: state.completedSteps.length / 3, // 3 étapes totales
  };
};
