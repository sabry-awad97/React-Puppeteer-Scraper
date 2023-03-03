# Documentation for `ElementDataSource` class

---

## Class Description

`ElementDataSource` is a Readable stream that provides a sequence of `ElementHandle<Element>` objects to be processed in a pipeline.

## Class Constructor

`ElementDataSource` constructor takes an array of `ElementHandle<Element>` objects to be processed. It calls the `super` method of the parent `Readable` class with the options object `{ objectMode: true }`, indicating that this stream will be in object mode.

## Class Methods

`_read()`: Overrides the parent `_read()` method to push each `ElementHandle<Element>` object in the sequence to the stream until there are no more objects left, at which point it pushes `null` to signal the end of the stream.

## Class Properties

`elementHandles`: An array of `ElementHandle<Element>` objects passed to the constructor.

`currentIndex`: An integer representing the current position in the `elementHandles` array.

## Example Usage

javascriptCopy code

```js
import { ElementDataSource } from './ElementDataSource';

const elementsToProcess = [
  /* array of ElementHandle<Element> objects */
];
const elementDataSource = new ElementDataSource(elementsToProcess);

// Use elementDataSource as a source for a stream pipeline
```
