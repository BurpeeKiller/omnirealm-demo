/**
 * Array helper utilities
 */

/**
 * Get unique values from array
 * @param array - Array to process
 * @param key - Optional key for objects
 * @returns Array with unique values
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Split array into chunks of specified size
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Group array items by key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Shuffle array randomly
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * @param array - Array to pick from
 * @returns Random item
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get multiple random items from array
 * @param array - Array to pick from
 * @param count - Number of items to pick
 * @returns Array of random items
 */
export function sampleSize<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

/**
 * Create array of numbers from start to end
 * @param start - Start number
 * @param end - End number
 * @param step - Step size (default: 1)
 * @returns Array of numbers
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Remove falsy values from array
 * @param array - Array to compact
 * @returns Array without falsy values
 */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}