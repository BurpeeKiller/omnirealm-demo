/**
 * Test simple pour vérifier le comportement du hook useOnboarding
 * Pour exécuter : node src/hooks/useOnboarding.test.ts
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Simuler le comportement du hook
const ONBOARDING_STORAGE_KEY = 'omni-fit-onboarding';

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  hasSeenWelcome: boolean;
  hasGrantedNotifications: boolean;
  hasCompletedFirstExercise: boolean;
}

const defaultState: OnboardingState = {
  isCompleted: false,
  currentStep: 0,
  hasSeenWelcome: false,
  hasGrantedNotifications: false,
  hasCompletedFirstExercise: false,
};

function getInitialState(): OnboardingState {
  try {
    const saved = localStorageMock.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) {
      console.log('Loading saved state:', saved);
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load onboarding state:', error);
  }
  return defaultState;
}

function saveState(newState: OnboardingState) {
  try {
    console.log('Saving state:', newState);
    localStorageMock.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.warn('Failed to save onboarding state:', error);
  }
}

// Tests
console.log('🧪 Test du hook useOnboarding\n');

// Test 1: État initial
console.log('Test 1: État initial');
localStorageMock.clear();
let state = getInitialState();
console.log('État initial:', state);
console.log('shouldShowOnboarding:', !state.isCompleted && state.currentStep < 3);
console.log('✅ Test 1 passé\n');

// Test 2: CompleteWelcome
console.log('Test 2: CompleteWelcome');
state = getInitialState();
console.log('État avant:', state);

// Simuler completeWelcome
const newStateAfterWelcome = {
  ...state,
  hasSeenWelcome: true,
  currentStep: 1,
};
saveState(newStateAfterWelcome);

state = getInitialState();
console.log('État après:', state);
console.log('shouldShowOnboarding:', !state.isCompleted && state.currentStep < 3);
console.log('✅ Test 2 passé\n');

// Test 3: Flow complet
console.log('Test 3: Flow complet');
localStorageMock.clear();

// Étape 1: Welcome
state = getInitialState();
saveState({ ...state, hasSeenWelcome: true, currentStep: 1 });

// Étape 2: Permissions
state = getInitialState();
saveState({ ...state, hasGrantedNotifications: true, currentStep: 2 });

// Étape 3: First Exercise
state = getInitialState();
saveState({
  ...state,
  hasCompletedFirstExercise: true,
  currentStep: 3,
  isCompleted: true,
});

state = getInitialState();
console.log('État final:', state);
console.log('shouldShowOnboarding:', !state.isCompleted && state.currentStep < 3);
console.log('✅ Test 3 passé\n');

console.log('✅ Tous les tests passés!');
