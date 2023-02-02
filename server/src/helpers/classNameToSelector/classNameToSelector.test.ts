import { describe, it, expect } from 'vitest';
import { classNameToSelector } from './classNameToSelector';

describe('classNameToSelector', () => {
  it('should return null when class name is undefined or null', () => {
    expect(classNameToSelector(undefined as any)).toBe(null);
    expect(classNameToSelector(null)).toBe(null);
  });

  it('should return a valid CSS selector', () => {
    expect(classNameToSelector('class1 class2')).toBe('.class1.class2');
    expect(classNameToSelector(' class1  class2  ')).toBe('.class1.class2');
  });

  it('should handle edge cases', () => {
    expect(classNameToSelector('')).toBe(null);
    expect(classNameToSelector('  ')).toBe(null);
    expect(classNameToSelector('a b c')).toBe('.a.b.c');
  });
});
