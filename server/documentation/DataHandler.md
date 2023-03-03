# DataHandler Class

The `DataHandler` class is responsible for handling data processing, cleaning and storage.

## Constructor

The class constructor initializes an `EventEmitter` instance.

## Methods

### `saveToFile`

Saves the given data object to a JSON file in the specified path.

#### Parameters

- `data`: The data object to be saved.
- `filePath`: The path of the file where the data will be saved.

#### Events

- `dataSave:start`: Emitted when the data save process starts.
- `dataSave:success`: Emitted when the data save process finishes successfully.
- `dataSave:error`: Emitted when the data save process fails with an error.

### `saveToMongo`

Saves the given array of records to MongoDB.

#### Parameters

- `data`: The array of records to be saved.

#### Events

- `dataSave:start`: Emitted when the data save process starts.
- `dataSave:success`: Emitted when the data save process finishes successfully.
- `dataSave:error`: Emitted when the data save process fails with an error.

#### `cleanData`

Cleans the given array by removing duplicate values.

#### Parameters

- `data`: The array of data to be cleaned.

#### Returns

An array of unique values.

#### Events

- `cleanData:start`: Emitted when the data cleaning process starts.
- `cleanData:success`: Emitted when the data cleaning process finishes successfully.

### `on`

Attaches an event listener to the specified event.

#### Parameters

- `event`: The name of the event to attach the listener to.
- `listener`: The listener function to be called when the event is emitted.

### `emit`

Emits the specified event with the given arguments.

#### Parameters

- `event`: The name of the event to be emitted.
- `args`: The arguments to be passed to the event listeners.
