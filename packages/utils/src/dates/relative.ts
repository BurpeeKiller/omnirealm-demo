/**
 * Relative time formatting utilities
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format relative time in French (e.g., "il y a 2 heures", "dans 3 jours")
 * @param date - Date to format relative to now
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: string | Date | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const absoluteDiff = Math.abs(diffInMs);
  const isFuture = diffInMs < 0;
  
  // Less than a minute
  if (absoluteDiff < MINUTE) {
    return isFuture ? "dans quelques secondes" : "à l'instant";
  }
  
  // Less than an hour
  if (absoluteDiff < HOUR) {
    const minutes = Math.floor(absoluteDiff / MINUTE);
    const plural = minutes > 1 ? 's' : '';
    return isFuture 
      ? `dans ${minutes} minute${plural}`
      : `il y a ${minutes} minute${plural}`;
  }
  
  // Less than a day
  if (absoluteDiff < DAY) {
    const hours = Math.floor(absoluteDiff / HOUR);
    const plural = hours > 1 ? 's' : '';
    return isFuture
      ? `dans ${hours} heure${plural}`
      : `il y a ${hours} heure${plural}`;
  }
  
  // Less than a week
  if (absoluteDiff < WEEK) {
    const days = Math.floor(absoluteDiff / DAY);
    const plural = days > 1 ? 's' : '';
    return isFuture
      ? `dans ${days} jour${plural}`
      : `il y a ${days} jour${plural}`;
  }
  
  // Less than a month
  if (absoluteDiff < MONTH) {
    const weeks = Math.floor(absoluteDiff / WEEK);
    const plural = weeks > 1 ? 's' : '';
    return isFuture
      ? `dans ${weeks} semaine${plural}`
      : `il y a ${weeks} semaine${plural}`;
  }
  
  // Less than a year
  if (absoluteDiff < YEAR) {
    const months = Math.floor(absoluteDiff / MONTH);
    return isFuture
      ? `dans ${months} mois`
      : `il y a ${months} mois`;
  }
  
  // More than a year - show full date
  return targetDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const today = new Date();
  const targetDate = new Date(date);
  
  return (
    targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 * @param date - Date to check
 * @returns True if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  
  return (
    targetDate.getDate() === yesterday.getDate() &&
    targetDate.getMonth() === yesterday.getMonth() &&
    targetDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if a date is tomorrow
 * @param date - Date to check
 * @returns True if date is tomorrow
 */
export function isTomorrow(date: Date | string | number): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = new Date(date);
  
  return (
    targetDate.getDate() === tomorrow.getDate() &&
    targetDate.getMonth() === tomorrow.getMonth() &&
    targetDate.getFullYear() === tomorrow.getFullYear()
  );
}