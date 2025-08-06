import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from '../../hooks/useOnboarding';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with default state when no saved state', () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state).toEqual({
      isCompleted: false,
      currentStep: 0,
      hasSeenWelcome: false,
      hasGrantedNotifications: false,
      hasCompletedFirstExercise: false,
    });
    expect(result.current.shouldShowOnboarding).toBe(true);
  });

  it('should load saved state from localStorage', () => {
    const savedState = {
      isCompleted: false,
      currentStep: 1,
      hasSeenWelcome: true,
      hasGrantedNotifications: false,
      hasCompletedFirstExercise: false,
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state).toEqual(savedState);
    expect(result.current.shouldShowOnboarding).toBe(true);
  });

  it('should not show onboarding when completed', () => {
    const completedState = {
      isCompleted: true,
      currentStep: 3,
      hasSeenWelcome: true,
      hasGrantedNotifications: true,
      hasCompletedFirstExercise: true,
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(completedState));

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldShowOnboarding).toBe(false);
  });

  it('should complete welcome step correctly', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeWelcome();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fitness-reminder-onboarding',
      JSON.stringify({
        isCompleted: false,
        currentStep: 1,
        hasSeenWelcome: true,
        hasGrantedNotifications: false,
        hasCompletedFirstExercise: false,
      }),
    );
  });

  it('should complete permissions step correctly', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completePermissions(true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fitness-reminder-onboarding',
      JSON.stringify({
        isCompleted: false,
        currentStep: 2,
        hasSeenWelcome: false,
        hasGrantedNotifications: true,
        hasCompletedFirstExercise: false,
      }),
    );
  });

  it('should complete first exercise and finish onboarding', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeFirstExercise();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fitness-reminder-onboarding',
      JSON.stringify({
        isCompleted: true,
        currentStep: 3,
        hasSeenWelcome: false,
        hasGrantedNotifications: false,
        hasCompletedFirstExercise: true,
      }),
    );
  });

  it('should reset onboarding correctly', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.resetOnboarding();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('fitness-reminder-onboarding');
    expect(result.current.state).toEqual({
      isCompleted: false,
      currentStep: 0,
      hasSeenWelcome: false,
      hasGrantedNotifications: false,
      hasCompletedFirstExercise: false,
    });
  });

  it('should skip onboarding correctly', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.skipOnboarding();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fitness-reminder-onboarding',
      JSON.stringify({
        isCompleted: true,
        currentStep: 3,
        hasSeenWelcome: true,
        hasGrantedNotifications: false,
        hasCompletedFirstExercise: true,
      }),
    );
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const { result } = renderHook(() => useOnboarding());

    // Should fall back to default state
    expect(result.current.state).toEqual({
      isCompleted: false,
      currentStep: 0,
      hasSeenWelcome: false,
      hasGrantedNotifications: false,
      hasCompletedFirstExercise: false,
    });
  });

  it('should handle save errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Save failed');
    });

    const { result } = renderHook(() => useOnboarding());

    // Should not throw error
    act(() => {
      result.current.completeWelcome();
    });

    // State should still be default since save failed
    expect(result.current.state.hasSeenWelcome).toBe(false);
  });
});
