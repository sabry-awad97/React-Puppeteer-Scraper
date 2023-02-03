import { omit } from './omit';
import { expect, describe, it } from 'vitest';

describe('omit function', () => {
  it('should omit the specified keys', () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const result = omit(object, 'b', 'd');
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should return an empty object if all keys are omitted', () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const result = omit(object, 'a', 'b', 'c', 'd');
    expect(result).toEqual({});
  });
});
