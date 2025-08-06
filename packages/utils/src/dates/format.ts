/**
 * Date formatting utilities
 */

/**
 * Format time in MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted string "MM:SS"
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format date in French locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('fr-FR', options);
}

/**
 * Format date and time
 * @param date - Date to format
 * @returns Formatted string "DD/MM/YYYY à HH:MM"
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('fr-FR');
  const timeStr = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${dateStr} à ${timeStr}`;
}

/**
 * Get time of day greeting in French
 * @param hour - Hour of day (0-23)
 * @returns Greeting string
 */
export function getTimeOfDayGreeting(hour?: number): string {
  const currentHour = hour ?? new Date().getHours();
  
  if (currentHour < 6) return 'Bonne nuit';
  if (currentHour < 12) return 'Bonjour';
  if (currentHour < 18) return 'Bon après-midi';
  if (currentHour < 22) return 'Bonsoir';
  return 'Bonne nuit';
}

/**
 * Format duration in human readable format
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted string "Xh Ymin" or "Ymin Zsec"
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  }
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}min${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
  }
  
  return `${seconds}s`;
}