import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Semaphore } from './Semaphore';

describe('Semaphore', () => {
  let semaphore: Semaphore;
  let concurrency = 2;
  beforeEach(() => {
    semaphore = new Semaphore(concurrency);
  });

  it('should acquire a resource', async () => {
    await semaphore.acquire();
    expect(semaphore['semaphore']['available']).toBe(concurrency - 1);
  });

  it('should release a resource', async () => {
    await semaphore.acquire();
    semaphore.release();
    expect(semaphore['semaphore']['available']).toBe(concurrency);
  });

  it('should propagates an error if one occurs during task execution', async () => {
    const error = new Error('Test Error');

    const task = async () => {
      await semaphore.acquire();
      semaphore.release(error);
      throw error;
    };

    await expect(task()).rejects.toThrow(error);

    const increment = async () => {
      await semaphore.acquire();
      semaphore.release();
    };

    await expect(increment()).rejects.toThrow(error);
  });

  it('should not release a resource if error is passed', async () => {
    await semaphore.acquire();
    semaphore.release(new Error('test error'));
    expect(semaphore['semaphore']['available']).toBe(concurrency);
  });

  it('should call release callbacks', async () => {
    const spy = vi.fn();
    semaphore.onRelease(spy);

    async function worker() {
      await semaphore.acquire();
      semaphore.release();
    }

    await worker();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
