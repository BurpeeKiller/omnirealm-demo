/**
 * Simple rate limiter côté client pour éviter le spam
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private config: RateLimitConfig) {}

  /**
   * Vérifie si une action peut être exécutée
   * @param key - Identifiant unique de l'action (ex: 'exercise-increment', 'api-call')
   * @returns true si l'action est autorisée, false sinon
   */
  canExecute(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Nettoyer les anciennes requêtes
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < this.config.windowMs
    );
    
    if (validTimestamps.length >= this.config.maxRequests) {
      return false;
    }
    
    // Ajouter la nouvelle requête
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }

  /**
   * Réinitialise le compteur pour une clé spécifique
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Réinitialise tous les compteurs
   */
  resetAll(): void {
    this.requests.clear();
  }

  /**
   * Obtient le temps restant avant la prochaine fenêtre
   */
  getTimeUntilReset(key: string): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) return 0;
    
    const oldestTimestamp = Math.min(...timestamps);
    const timeElapsed = Date.now() - oldestTimestamp;
    const timeRemaining = Math.max(0, this.config.windowMs - timeElapsed);
    
    return timeRemaining;
  }
}

// Rate limiters préconfigurés
export const exerciseRateLimiter = new RateLimiter({
  maxRequests: 10, // Max 10 incréments
  windowMs: 1000, // Par seconde
});

export const apiRateLimiter = new RateLimiter({
  maxRequests: 20, // Max 20 appels API
  windowMs: 60000, // Par minute
});

export const notificationRateLimiter = new RateLimiter({
  maxRequests: 3, // Max 3 notifications
  windowMs: 10000, // Par 10 secondes
});

// Hook React pour utiliser le rate limiter
import { useCallback } from 'react';

export const useRateLimiter = (
  rateLimiter: RateLimiter,
  key: string,
  onRateLimited?: () => void
) => {
  const checkRateLimit = useCallback(() => {
    if (!rateLimiter.canExecute(key)) {
      onRateLimited?.();
      return false;
    }
    return true;
  }, [rateLimiter, key, onRateLimited]);

  const reset = useCallback(() => {
    rateLimiter.reset(key);
  }, [rateLimiter, key]);

  const getTimeUntilReset = useCallback(() => {
    return rateLimiter.getTimeUntilReset(key);
  }, [rateLimiter, key]);

  return {
    checkRateLimit,
    reset,
    getTimeUntilReset,
  };
};