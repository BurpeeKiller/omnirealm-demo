import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTime, formatRelativeTime, isToday } from '../src/dates';

describe('dates utilities', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(125)).toBe('02:05');
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current date
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-18T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format past times correctly', () => {
      expect(formatRelativeTime(new Date('2025-01-18T11:59:30'))).toBe("à l'instant");
      expect(formatRelativeTime(new Date('2025-01-18T11:30:00'))).toBe('il y a 30 minutes');
      expect(formatRelativeTime(new Date('2025-01-18T10:00:00'))).toBe('il y a 2 heures');
      expect(formatRelativeTime(new Date('2025-01-17T12:00:00'))).toBe('il y a 1 jour');
    });

    it('should format future times correctly', () => {
      expect(formatRelativeTime(new Date('2025-01-18T12:30:00'))).toBe('dans 30 minutes');
      expect(formatRelativeTime(new Date('2025-01-18T14:00:00'))).toBe('dans 2 heures');
      expect(formatRelativeTime(new Date('2025-01-19T12:00:00'))).toBe('dans 1 jour');
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-18T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should correctly identify today', () => {
      expect(isToday(new Date('2025-01-18T00:00:00'))).toBe(true);
      expect(isToday(new Date('2025-01-18T23:59:59'))).toBe(true);
      expect(isToday(new Date('2025-01-17T23:59:59'))).toBe(false);
      expect(isToday(new Date('2025-01-19T00:00:00'))).toBe(false);
    });
  });
});