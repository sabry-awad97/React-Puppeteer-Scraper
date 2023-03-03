# Documentation for the Model

## Model Definition

The `Record` model is defined using Mongoose, a popular Node.js ODM (Object Data Modeling) library for MongoDB. The model has two fields: `url` and `lastUpdated` but it can have multiple fields.

The `url` field is a required string that represents the URL of a web page that has been scraped. The `lastUpdated` field is a date that indicates when the record was last updated. This field is not required, and if it is not provided, the current date will be used as the default value.

The `recordSchema` object is created using Mongoose's `Schema` class, which defines the schema for the `Record` model. The schema is then passed to the `mongoose.model()` function to create the `Record` model.

## Export

The `Record` model is exported as the default export of the module, so it can be imported and used in other modules.

## Usage

To use the `Record` model in a Node.js application, you can import it like this:

```js
import Record from './Model.js';

// Use the Record model to save records to the database
const record = new Record({ url: 'http://example.com' });
await record.save();
```

In this example, we first import the `Record` model from the `Model.js` file. Then we create a new record with the URL `http://example.com` using the `Record` model, and save it to the database using the `save()` method.
