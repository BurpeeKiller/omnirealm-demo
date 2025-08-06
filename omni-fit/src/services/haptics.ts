// Capacitor imports commented out - PWA mode only
// import { Haptics, ImpactStyle } from '@capacitor/haptics';
// import { Capacitor } from '@capacitor/core';

/**
 * Vibration légère pour les interactions UI
 */
export async function vibrateFeedback() {
  // PWA mode only - use navigator.vibrate
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

/**
 * Vibration moyenne pour les succès
 */
export async function vibrateSuccess() {
  // PWA mode only - use navigator.vibrate
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
}

/**
 * Vibration forte pour les erreurs ou alertes importantes
 */
export async function vibrateError() {
  // PWA mode only - use navigator.vibrate
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
}

/**
 * Pattern de vibration personnalisé pour les rappels
 */
export async function vibrateReminder() {
  // PWA mode only - use navigator.vibrate
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

/**
 * Notification haptique pour complétion d'exercice
 */
export async function vibrateExerciseComplete() {
  // PWA mode only - use navigator.vibrate
  if ('vibrate' in navigator) {
    // Pattern distinctif : court-court-long
    navigator.vibrate([50, 50, 50, 50, 200]);
  }
}
