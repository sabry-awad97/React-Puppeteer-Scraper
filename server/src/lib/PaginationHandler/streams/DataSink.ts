import { Writable, TransformCallback } from 'stream';
import { IRecord } from '../../../types/index.js';

export class DataSink extends Writable {
  private readonly collectedData: IRecord[];
  private readonly onSuccess: (
    value: IRecord[] | PromiseLike<IRecord[]>
  ) => void;
  private readonly onError: (reason?: any) => void;
  private processedElementCount = 0;

  constructor(
    collectedData: IRecord[],
    onSuccess: (value: IRecord[] | PromiseLike<IRecord[]>) => void,
    onError: (reason?: any) => void
  ) {
    super({ objectMode: true });
    this.collectedData = collectedData;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  override _write(
    chunk: IRecord,
    _: BufferEncoding,
    callback: TransformCallback
  ) {
    this.processedElementCount++;
    this.collectedData.push(chunk);
    callback();
  }

  override _final(callback: () => void) {
    if (this.processedElementCount === this.collectedData.length) {
      this.onSuccess(this.collectedData);
    } else {
      this.onError(new Error('Error processing elements'));
    }
    callback();
  }
}
