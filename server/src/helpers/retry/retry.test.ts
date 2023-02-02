import { describe, it, vi, expect } from 'vitest';
import { retry } from './retry.js';

describe('retry', () => {
  it('should return the result of the function if it succeeds', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const result = await retry(mockFn);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry the function multiple times if it fails', async () => {
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('failure 1'))
      .mockRejectedValueOnce(new Error('failure 2'))
      .mockResolvedValue('success');
    const result = await retry(mockFn);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should throw an error if the function keeps failing', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
    await expect(retry(mockFn)).rejects.toThrowError('Retry limit exceeded.');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
