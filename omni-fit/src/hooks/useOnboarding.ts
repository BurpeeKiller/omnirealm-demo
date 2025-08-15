import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  hasSeenWelcome: boolean;
  hasGrantedNotifications: boolean;
  hasCompletedFirstExercise: boolean;
}

const ONBOARDING_STORAGE_KEY = 'omnifit_onboarding_state';

const defaultState: OnboardingState = {
  isCompleted: false,
  currentStep: 0,
  hasSeenWelcome: false,
  hasGrantedNotifications: false,
  hasCompletedFirstExercise: false,
};

export const useOnboarding = () => {
  // Initialiser l'état depuis localStorage directement
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (saved) {
        // logger.info('Loading saved onboarding state:', saved);
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.warn('Failed to load onboarding state:', error);
    }
    return defaultState;
  });

  // Sauvegarder l'état dans localStorage ET mettre à jour l'état React
  const saveState = (newState: OnboardingState) => {
    try {
      // logger.info('Saving onboarding state:', newState);
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      logger.warn('Failed to save onboarding state:', error);
    }
  };

  // Actions de l'onboarding
  const completeWelcome = () => {
    const newState = {
      ...state,
      hasSeenWelcome: true,
      currentStep: 1,
    };
    saveState(newState);
  };

  const completePermissions = (notificationsGranted: boolean = false) => {
    const newState = {
      ...state,
      hasGrantedNotifications: notificationsGranted,
      currentStep: 2,
    };
    saveState(newState);
  };

  const completeFirstExercise = () => {
    const newState = {
      ...state,
      hasCompletedFirstExercise: true,
      currentStep: 3,
      isCompleted: true,
    };
    saveState(newState);
    // Synchroniser avec l'autre système
    localStorage.setItem('omnifit_onboarding_completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem('omnifit_onboarding_completed');
    setState(defaultState);
  };

  const skipOnboarding = () => {
    const completedState: OnboardingState = {
      isCompleted: true,
      currentStep: 3,
      hasSeenWelcome: true,
      hasGrantedNotifications: false,
      hasCompletedFirstExercise: true,
    };
    saveState(completedState);
    // Synchroniser avec l'autre système
    localStorage.setItem('omnifit_onboarding_completed', 'true');
  };

  // Calculer si l'onboarding doit être affiché
  const shouldShowOnboarding = !state.isCompleted;

  // Réduire les logs - seulement sur les changements importants
  // logger.info('useOnboarding - state:', state);

  return {
    state,
    shouldShowOnboarding,
    completeWelcome,
    completePermissions,
    completeFirstExercise,
    resetOnboarding,
    skipOnboarding,
    completeOnboarding: skipOnboarding, // alias pour compatibilité
  };
};
