# Documentation for the DataSink Class

## Description

The DataSink class is a Writable stream that receives records, collects them in an array, and passes them on to the next stream in the pipeline. Once all records have been received, it calls the success callback with the collected data. If there is an error while processing records, it calls the error callback.

## Properties

- `collectedData`: An array of IRecord objects to collect the data that passes through the stream.
- `onSuccess`: A callback function that will be called with the collected data once all records have been processed successfully.
- `onError`: A callback function that will be called if an error occurs while processing records.
- processedElementCount: A counter to keep track of the number of processed records.

## Methods

- `constructor(collectedData: IRecord[], onSuccess: (value: IRecord[] | PromiseLike<IRecord[]>) => void, onError: (reason?: any) => void)`: Constructs a new DataSink object with the given parameters.
- `write(chunk: IRecord)`: BufferEncoding, callback: TransformCallback): This method is called every time a new record is passed to the stream. It collects the record in the collectedData array and calls the callback to indicate that the record has been processed.
- `final(callback: () => void)`: This method is called once all records have been processed. It checks if all records have been processed successfully and calls the appropriate callback function (onSuccess or onError) depending on the result. It then calls the callback to indicate that the stream has ended.

## Usage

The DataSink class is used to collect data that passes through a stream and pass it on to the next stream in the pipeline. An example usage of the class is as follows:

```js
import { DataSink } from './DataSink.js';

const collectedData: IRecord[] = [];

const onSuccess = (data: IRecord[]) => {
  console.log('Data collected successfully:', data);
};

const onError = (err: any) => {
  console.error('Error collecting data:', err);
};

const dataSink = new DataSink(collectedData, onSuccess, onError);

// use dataSink in the stream pipeline
```

In this example, a DataSink object is created with an empty array to collect records and success and error callback functions. It is then used in a stream pipeline to collect records and pass them on to the next stream. Once all records have been processed, the success or error callback is called with the collected data.
