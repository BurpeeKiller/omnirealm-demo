import { logger } from '@/utils/logger';

// Générateur de sons avec Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Son de rappel - bip bip
  playReminderSound(): void {
    try {
      const ctx = this.getAudioContext();

      // Premier bip
      this.createBeep(ctx, 800, 0, 0.2);
      // Deuxième bip
      this.createBeep(ctx, 800, 0.3, 0.2);
      // Troisième bip (plus aigu)
      this.createBeep(ctx, 1000, 0.6, 0.3);
    } catch (error) {
      logger.warn('Could not play reminder sound:', error);
    }
  }

  // Son de complétion - ding de réussite
  playCompleteSound(): void {
    try {
      const ctx = this.getAudioContext();

      // Accord de réussite
      this.createBeep(ctx, 523, 0, 0.15); // Do
      this.createBeep(ctx, 659, 0.1, 0.15); // Mi
      this.createBeep(ctx, 784, 0.2, 0.25); // Sol
    } catch (error) {
      logger.warn('Could not play complete sound:', error);
    }
  }

  private createBeep(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
  ): void {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // Envelope pour éviter les clics
    const now = ctx.currentTime + startTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Decay

    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

export const soundGenerator = new SoundGenerator();

// Hook pour utiliser les sons
export const useSound = () => {
  const playReminder = () => {
    soundGenerator.playReminderSound();
  };

  const playComplete = () => {
    soundGenerator.playCompleteSound();
  };

  return {
    playReminder,
    playComplete,
  };
};

// Fonction utilitaire pour les tests
export const playSound = (type: 'complete' | 'reminder') => {
  try {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.5;
    audio.play();
  } catch (error) {
    logger.warn(`Could not play ${type} sound:`, error);
  }
};
