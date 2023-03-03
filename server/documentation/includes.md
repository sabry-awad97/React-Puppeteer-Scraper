# Documentation for the `includes` function

## Function `includes`

The `includes` function checks if an array includes a given element. It takes two arguments:

1. An array of any type, named `array`.
2. A target element of any type, named `target`.

The function uses the `some` method of the array, which returns `true` if at least one element in the array satisfies a test. The test is defined by the helper function `isEqual`, which compares two elements for equality. If any element in the array is equal to the target element, the function returns `true`. Otherwise, it returns `false`.

## Helper function `isEqual`

The `isEqual` function compares two values for equality. It takes two arguments, `a` and `b`, of any type. The function uses the `JSON.stringify()` method to convert the values to strings and compare them. This method returns a JSON string representation of the value. The function returns `true` if the string representation of `a` is equal to the string representation of `b`, and `false` otherwise.

## Usage

To use the `includes` function, you can import it like this:

```js
import { includes } from './includes.js';

// Check if an array includes an element
const array = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
];
const target = { x: 3, y: 4 };
const result = includes(array, target); // Returns true
```

In this example, we import the `includes` function from the `includes.js` file. We then call the function with an array and a target element, and it returns `true` because the array includes an element that is equal to the target element.
