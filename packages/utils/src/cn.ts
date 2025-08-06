import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * Handles conditional classes and Tailwind CSS conflicts
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' if condition is true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple version without dependencies for lightweight usage
 * Only handles basic string concatenation and filtering
 */
export function cnLite(...inputs: (string | undefined | null | boolean)[]) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}