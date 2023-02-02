import { Semaphore } from '../Semaphore/Semaphore.js';

type Task<T> = () => Promise<T>;

export class TaskQueue<T> {
  private readonly tasks: Array<Task<T>> = [];
  private readonly semaphore: Semaphore;

  constructor(concurrency: number) {
    this.semaphore = new Semaphore(concurrency);
  }

  add(task: Task<T>) {
    this.tasks.push(task);
  }

  async run(): Promise<Array<T>> {
    const results: Array<T> = [];
    const promises = this.tasks.map(async (task, index) => {
      await this.semaphore.acquire();
      try {
        const result = await task();
        results[index] = result;
      } catch (error) {
        this.semaphore.release();
        throw error;
      } finally {
        this.semaphore.release();
      }
    });
    await Promise.all(promises);
    return results;
  }
}
