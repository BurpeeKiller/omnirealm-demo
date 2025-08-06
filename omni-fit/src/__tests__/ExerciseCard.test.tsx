import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseCard } from '../components/ExerciseCard';

// Mock des stores
vi.mock('../stores/exercises.store', () => ({
  useExercisesStore: vi.fn(() => ({
    incrementExercise: vi.fn(),
    loading: false,
  })),
}));

vi.mock('../stores/settings.store', () => ({
  useSettingsStore: vi.fn(() => ({
    soundEnabled: true,
  })),
}));

vi.mock('../utils/sound', () => ({
  useSound: vi.fn(() => ({
    playComplete: vi.fn(),
  })),
}));

const mockExercise = {
  type: 'burpees',
  name: 'Burpees',
  emoji: '🏃‍♂️',
  count: 5,
  increment: 1,
};

describe('ExerciseCard', () => {
  it('renders exercise information correctly', () => {
    render(<ExerciseCard exercise={mockExercise} index={0} />);

    // Vérifier que les informations de l'exercice sont affichées
    expect(screen.getByText('Burpees')).toBeInTheDocument();
    expect(screen.getByText('🏃‍♂️')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('calls incrementExercise when clicked', async () => {
    const user = userEvent.setup();
    const mockIncrementExercise = vi.fn();

    // Mock du store avec la fonction
    vi.mocked(require('../stores/exercises.store').useExercisesStore).mockReturnValue({
      incrementExercise: mockIncrementExercise,
      loading: false,
    });

    render(<ExerciseCard exercise={mockExercise} index={0} />);

    // Cliquer sur la carte
    const card = screen.getByText('Burpees').closest('div');
    await user.click(card!);

    // Vérifier que incrementExercise a été appelée
    expect(mockIncrementExercise).toHaveBeenCalledWith('burpees');
  });

  it('displays zero count correctly', () => {
    const zeroExercise = { ...mockExercise, count: 0 };

    render(<ExerciseCard exercise={zeroExercise} index={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays large count correctly', () => {
    const largeExercise = { ...mockExercise, count: 999 };

    render(<ExerciseCard exercise={largeExercise} index={0} />);

    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('disables interaction when loading', () => {
    // Mock du store en état de chargement
    vi.mocked(require('../stores/exercises.store').useExercisesStore).mockReturnValue({
      incrementExercise: vi.fn(),
      loading: true,
    });

    render(<ExerciseCard exercise={mockExercise} index={0} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows increment value correctly', () => {
    const customExercise = { ...mockExercise, increment: 5 };

    render(<ExerciseCard exercise={customExercise} index={0} />);

    expect(screen.getByText('+5')).toBeInTheDocument();
  });
});
