interface SemaphoreLike {
  available: number;
  acquire(): Promise<void>;
  release(): void;
}

class AsyncSemaphore implements SemaphoreLike {
  private _available: number;
  private readonly waiting: Array<() => void> = [];

  constructor(concurrency: number) {
    this._available = concurrency;
  }

  get available(): number {
    return this._available;
  }

  async acquire(): Promise<void> {
    if (this._available > 0) {
      this._available--;
      return;
    }
    return new Promise(resolve => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      this.waiting.shift()!();
    } else {
      this._available++;
    }
  }
}

export class Semaphore {
  private readonly semaphore: SemaphoreLike;
  private error: Error | null = null;
  private releaseCallbacks: Array<() => void> = [];

  constructor(concurrency: number) {
    this.semaphore = new AsyncSemaphore(concurrency);
  }

  async acquire(): Promise<void> {
    if (this.error) {
      throw this.error;
    }
    return this.semaphore.acquire();
  }

  release(error?: Error): void {
    if (error) {
      this.error = error;
    }
    this.semaphore.release();
    if (this.releaseCallbacks.length > 0) {
      this.releaseCallbacks.shift()!();
    }
  }

  onRelease(callback: () => void): void {
    this.releaseCallbacks.push(callback);
  }
}
