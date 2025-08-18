import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock du Dashboard component
vi.mock('../pages/Dashboard', () => ({
  default: () => (
    <div>
      <div data-testid="exercise-card-burpees">Burpees</div>
      <div data-testid="exercise-card-pushups">Pompes</div>
      <div data-testid="exercise-card-squats">Squats</div>
      <div>Réglages</div>
      <div>Stats</div>
    </div>
  ),
}));

// Mock des stores
vi.mock('../stores/exercises.store', () => ({
  useExercisesStore: () => ({
    exercises: [
      { type: 'burpees', name: 'Burpees', emoji: '🔥', count: 0, increment: 10 },
      { type: 'pushups', name: 'Pompes', emoji: '💪', count: 0, increment: 10 },
      { type: 'squats', name: 'Squats', emoji: '🦵', count: 0, increment: 10 },
    ],
    loadTodayStats: vi.fn(),
    incrementExercise: vi.fn(),
    loading: false,
  }),
}));

// Mock du reminder store avec getState pour zustand
const mockReminderStore = {
  startTimer: vi.fn(),
  stopTimer: vi.fn(),
};

vi.mock('../stores/reminder.store', () => ({
  useReminderStore: Object.assign(
    () => mockReminderStore,
    {
      getState: () => mockReminderStore,
    }
  ),
}));

vi.mock('../hooks/useNotification', () => ({
  useNotification: () => ({
    requestPermission: vi.fn(),
  }),
}));

vi.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    state: {
      isCompleted: true,
      currentStep: 4,
      hasSeenWelcome: true,
      hasGrantedNotifications: true,
      hasCompletedFirstExercise: true,
    },
    shouldShowOnboarding: false,
    completeWelcome: vi.fn(),
    grantNotifications: vi.fn(),
    completeFirstExercise: vi.fn(),
    nextStep: vi.fn(),
    skipOnboarding: vi.fn(),
  }),
}));

vi.mock('../hooks/useAppState', () => ({
  useAppState: () => ({
    currentView: 'dashboard',
    startApp: vi.fn(),
    completeOnboarding: vi.fn(),
    resetApp: vi.fn(),
  }),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Mock spécifique pour framer-motion dans ce test
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the main application', async () => {
    render(<App />);

    // Attendre que le contenu se charge (Suspense)
    await waitFor(() => {
      expect(screen.getByText('Burpees')).toBeInTheDocument();
    });

    // Vérifier que les exercices sont présents
    expect(screen.getByText('Burpees')).toBeInTheDocument();
    expect(screen.getByText('Pompes')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
  });

  it('displays bottom navigation', () => {
    render(<App />);

    // Vérifier la navigation du bas
    expect(screen.getByText('Réglages')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('displays exercise cards with initial count of 0', () => {
    render(<App />);

    // Vérifier les cartes d'exercices avec data-testid
    const burpeesCard = screen.getByTestId('exercise-card-burpees');
    const pushupsCard = screen.getByTestId('exercise-card-pushups');
    const squatsCard = screen.getByTestId('exercise-card-squats');

    expect(burpeesCard).toBeInTheDocument();
    expect(pushupsCard).toBeInTheDocument();
    expect(squatsCard).toBeInTheDocument();

    // Vérifier que tous affichent 0
    expect(burpeesCard).toHaveTextContent('0');
    expect(pushupsCard).toHaveTextContent('0');
    expect(squatsCard).toHaveTextContent('0');
  });

  it('shows settings modal when settings button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Trouver et cliquer sur le bouton des paramètres
    const settingsButton = screen.getByText('Réglages');
    await user.click(settingsButton);

    // Vérifier que la modal des paramètres s'affiche
    await waitFor(() => {
      expect(screen.getByText('Paramètres')).toBeInTheDocument();
    });
  });

  it('shows stats modal when stats button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Trouver et cliquer sur le bouton des stats
    const statsButton = screen.getByText('Stats');
    await user.click(statsButton);

    // Vérifier que la modal des stats s'affiche
    await waitFor(() => {
      expect(screen.getByText('Statistiques')).toBeInTheDocument();
    });
  });
});
