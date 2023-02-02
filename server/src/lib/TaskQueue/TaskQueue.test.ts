import { describe, it, vi, expect, beforeEach } from 'vitest';
import { TaskQueue } from './TaskQueue';

describe('TaskQueue', () => {
  it('should run tasks with limited concurrency', async () => {
    const taskQueue = new TaskQueue(2);
    const task1 = vi.fn(() => Promise.resolve());
    const task2 = vi.fn(() => Promise.resolve());
    const task3 = vi.fn(() => Promise.resolve());

    taskQueue.add(task1);
    taskQueue.add(task2);
    taskQueue.add(task3);

    await taskQueue.run();

    expect(task1).toHaveBeenCalled();
    expect(task2).toHaveBeenCalled();
    expect(task3).toHaveBeenCalled();
  });

  it('should run tasks in order', async () => {
    const task1 = vi.fn(() => Promise.resolve());
    const task2 = vi.fn(() => Promise.resolve());
    const task3 = vi.fn(() => Promise.resolve());

    const taskQueue = new TaskQueue(2);

    taskQueue.add(task1);
    taskQueue.add(task2);
    taskQueue.add(task3);

    const order: string[] = [];

    task1.mockImplementation(() => {
      order.push('task1');
      return Promise.resolve();
    });

    task2.mockImplementation(() => {
      order.push('task2');
      return Promise.resolve();
    });

    task3.mockImplementation(() => {
      order.push('task3');
      return Promise.resolve();
    });

    await taskQueue.run();

    expect(order).toEqual(['task1', 'task2', 'task3']);
  });

  it('should run tasks with different results', async () => {
    const task1 = vi.fn(() => Promise.resolve(1));
    const task2 = vi.fn(() => Promise.resolve(2));
    const task3 = vi.fn(() => Promise.resolve(3));

    const taskQueue = new TaskQueue<number>(2);

    taskQueue.add(task1);
    taskQueue.add(task2);
    taskQueue.add(task3);

    const results = await taskQueue.run();

    expect(results).toEqual([1, 2, 3]);
  });
});
