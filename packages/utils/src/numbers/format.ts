/**
 * Number formatting utilities
 */

/**
 * Format number as currency (EUR by default)
 * @param amount - Amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale (default: fr-FR)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency = 'EUR',
  locale = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format number as percentage
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param assumeDecimal - If true, assumes value is 0-1 (default: true)
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number,
  decimals = 0,
  assumeDecimal = true
): string {
  const percentage = assumeDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separator
 * @param num - Number to format
 * @param locale - Locale (default: fr-FR)
 * @returns Formatted number string
 */
export function formatNumber(num: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format bytes to human readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Round number to specified decimal places
 * @param num - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function round(num: number, decimals = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp number between min and max values
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @param integer - Return integer (default: false)
 * @returns Random number
 */
export function random(min: number, max: number, integer = false): number {
  const num = Math.random() * (max - min) + min;
  return integer ? Math.floor(num) : num;
}