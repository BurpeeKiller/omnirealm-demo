/**
 * String validation utilities
 */

/**
 * Check if string is a valid email
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is a valid URL
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid phone number (French format)
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export function isPhoneFR(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Check if string contains only alphanumeric characters
 * @param str - String to check
 * @returns True if alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if string is a valid hex color
 * @param color - Color to validate
 * @returns True if valid hex color
 */
export function isHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Check if string is empty or only whitespace
 * @param str - String to check
 * @returns True if empty or whitespace
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Check if string is a valid JSON
 * @param str - String to validate
 * @returns True if valid JSON
 */
export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}