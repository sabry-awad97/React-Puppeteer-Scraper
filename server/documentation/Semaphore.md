# Class: Semaphore

The Semaphore class provides a way to limit the number of concurrent operations that can be performed at a given time. This is useful for preventing resource contention or overload in scenarios where a limited resource needs to be shared between multiple threads or processes.

Constructor:

`constructor(concurrency: number)`

- The constructor initializes a Semaphore instance with a given concurrency limit.

Properties:

`available: number`

- Returns the number of currently available permits.

Methods:

`async acquire(): Promise<void>`

- Attempts to acquire a permit from the semaphore. If no permits are available, the method waits until one becomes available.

`release(error?: Error): void`

- Releases a permit back to the semaphore, allowing another operation to proceed. If an error is provided, it will be thrown by any pending or future calls to `acquire()`.

`onRelease(callback: () => void): void`

- Registers a callback to be called when a permit is released back to the semaphore.

Example usage:

```js
const semaphore = new Semaphore(5);

async function performTask() {
  await semaphore.acquire();
  // Do some work
  semaphore.release();
}

// Call performTask() 10 times in parallel
Promise.all(Array.from({ length: 10 }, () => performTask()));
```

In this example, the Semaphore is initialized with a concurrency limit of 5, meaning that only 5 tasks can be executed simultaneously. The `performTask()` function acquires a permit from the semaphore using `acquire()`, performs some work, and then releases the permit using `release()`. The `Promise.all()` method is used to execute 10 instances of `performTask()` in parallel, which will be limited to a maximum of 5 at any given time due to the semaphore limit.
