import { describe, it, expect } from 'vitest';
import { cn, cnLite } from '../src/cn';

describe('cn (class names)', () => {
  it('should combine class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'true-class', false && 'false-class')).toBe('base true-class');
  });

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should merge tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('cnLite', () => {
  it('should combine class names without dependencies', () => {
    expect(cnLite('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('should filter falsy values', () => {
    expect(cnLite('base', false, null, undefined, '', 'end')).toBe('base end');
  });
});