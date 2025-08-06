/**
 * Service de gestion des sons
 */

// Sons de notification (base64 ou URLs)
const sounds = {
  success: '/sounds/complete.mp3', // Utilise complete.mp3 car success.mp3 n'existe pas
  click: '/sounds/complete.mp3', // Utilise complete.mp3 comme son de clic
  complete: '/sounds/complete.mp3',
  reminder: '/sounds/reminder.mp3',
};

/**
 * Joue un son
 */
export function playSound(soundName: keyof typeof sounds) {
  try {
    // Vérifier si le son est activé dans les préférences
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

    if (!soundEnabled) return;

    // Créer et jouer l'audio
    const audio = new Audio(sounds[soundName]);
    audio.volume = 0.5; // Volume modéré
    audio.play().catch((err) => {
      console.warn('Impossible de jouer le son:', err);
    });
  } catch (error) {
    console.warn('Erreur lors de la lecture du son:', error);
  }
}

/**
 * Active/désactive les sons
 */
export function toggleSound(enabled: boolean) {
  localStorage.setItem('soundEnabled', enabled.toString());
}

/**
 * Vérifie si les sons sont activés
 */
export function isSoundEnabled() {
  return localStorage.getItem('soundEnabled') !== 'false';
}
