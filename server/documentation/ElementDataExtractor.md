# Documentation: ElementDataExtractor class

---

The `ElementDataExtractor` class is a `Transform` stream that extracts data from Puppeteer `ElementHandle`s based on a given set of fields, and transforms the data into `IRecord` objects.

## Class Members

### `constructor(fieldData: IFieldData[], url: string, title: string)`

Creates an instance of the `ElementDataExtractor` class with the following parameters:

- `fieldData`: An array of objects, each representing a field to be extracted. Each field object should have the following properties:
  - `className`: A string representing the class name of the element to be extracted.
  - `fieldName`: A string representing the name of the field to be extracted.
  - `type`: A string representing the type of data to be extracted, either `'text'` or `'attribute'`.
- `url`: A string representing the URL of the page being scraped.
- `title`: A string representing the title of the page being scraped.

### `async _transform(element: ElementHandle<Element>, _: BufferEncoding, callback: TransformCallback)`

Transforms a single `ElementHandle` into an `IRecord` object, and passes it to the next stream in the pipeline. This method has the following parameters:

- `element`: The `ElementHandle` to be transformed.
- `_`: Unused parameter to satisfy the `Transform` stream interface.
- `callback`: A function that should be called once the transformation is complete. Takes two parameters:
  - `error`: An error object, or `null` if no error occurred.
  - `data`: The transformed `IRecord` object.

### `class Field`

Represents a single field to be extracted from an element. Has the following properties:

- `selector`: A string representing the selector for the element to be extracted.
- `name`: A string representing the name of the field to be extracted.
- `type`: A string representing the type of data to be extracted, either `'text'` or `'attribute'`.

### `async extractValue(parent: ElementHandle<Element>): Promise<any>`

Extracts the value of the field from a given parent element. This method has the following parameters:

- `parent`: The parent `ElementHandle` from which to extract the field value.

## Example Usage

```js
import { ElementDataExtractor } from './ElementDataExtractor';
import puppeteer from 'puppeteer';

const fieldData = [
  {
    className: 'product-name',
    fieldName: 'productName',
    type: 'text',
  },
  {
    className: 'product-price',
    fieldName: 'productPrice',
    type: 'text',
  },
  {
    className: 'product-rating',
    fieldName: 'productRating',
    type: 'attribute',
  },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://example.com');

  const elements = await page.$$('.product');

  const extractor = new ElementDataExtractor(
    fieldData,
    page.url(),
    await page.title()
  );

  elements.forEach(element => element.pipe(extractor).pipe(process.stdout));
})();
```
