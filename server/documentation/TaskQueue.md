# Class TaskQueue

The `TaskQueue` class allows you to execute a set of tasks with a limited level of concurrency.

## Constructor

### `new TaskQueue<T>(concurrency: number)`

Constructs a new `TaskQueue` instance with a specified concurrency level.

- `concurrency`: the maximum number of tasks that can be executed concurrently.

## Methods

### `add(task: () => Promise<T>): void`

Adds a new task to the queue.

- `task`: a function that returns a Promise representing the task.

### `async run(): Promise<T[]>`

Executes all the tasks in the queue with a limited level of concurrency, and returns an array of their results in the order they were added to the queue.

## Example

```js
import { TaskQueue } from './TaskQueue.js';

const taskQueue = new TaskQueue(5);

taskQueue.add(() => Promise.resolve('Task 1'));
taskQueue.add(() => Promise.resolve('Task 2'));
taskQueue.add(() => Promise.resolve('Task 3'));
taskQueue.add(() => Promise.resolve('Task 4'));
taskQueue.add(() => Promise.resolve('Task 5'));

const results = await taskQueue.run();
console.log(results); // Output: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5']
```
