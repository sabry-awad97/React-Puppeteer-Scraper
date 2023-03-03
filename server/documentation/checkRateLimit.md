# Documentation for the `checkRateLimit` function

## Variables

- `rateLimit`: A number that represents the maximum number of requests that can be made in a certain time period. The initial value is set to `1000`.
- `rateLimitStartTime`: A number that represents the time when the current rate limit period started. This is initialized to `undefined`.
- `rateLimitEndTime`: A number that represents the time when the current rate limit period will end. This is also initialized to `undefined`.
- `requestsCount`: A number that represents the number of requests made in the current rate limit period. The initial value is set to `0`.

## Function

The `checkRateLimit` function checks if the rate limit has been exceeded and waits if necessary. If the rate limit has not been exceeded, it updates the `rateLimitStartTime`, `rateLimitEndTime`, and `requestsCount` variables.

If the rate limit period has ended, the function will double the rate limit and reset the `requestsCount`.

The function returns a `Promise<void>`.

## Usage

To use the `checkRateLimit` function, you can import it like this:

```js
import { checkRateLimit } from './rateLimit.js';

// Check the rate limit before making a request
await checkRateLimit();
```

In this example, we import the `checkRateLimit` function from the `rateLimit.js` file. Then we call the function before making a request to ensure that the rate limit is not exceeded. If the rate limit is exceeded, the function will wait until the current rate limit period has ended before returning.
