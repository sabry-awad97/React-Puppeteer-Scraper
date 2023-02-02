import { writeFile } from 'fs/promises';
import { EventEmitter } from 'events';
import {
  DataSaveEvents,
  IRecord,
  PageEvents,
  ScraperEvents,
} from '../types/index.js';
import database from '../database/Database.js';

export class DataHandler {
  private eventEmitter: EventEmitter;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  async saveToFile(data: any, filePath: string) {
    this.eventEmitter.emit('dataSave:start', data);
    try {
      await writeFile(filePath + '.json', JSON.stringify(data, null, 2));
      this.eventEmitter.emit('dataSave:success', data, filePath);
    } catch (error) {
      this.eventEmitter.emit('dataSave:error', error);
    }
  }

  async saveToMongo(data: IRecord[]) {
    this.eventEmitter.emit('dataSave:start', data);
    try {
      await database.saveRecords(data);
      this.eventEmitter.emit('dataSave:success', data);
    } catch (error) {
      this.eventEmitter.emit('dataSave:error', error);
    }
  }

  cleanData<T>(data: T[]): T[] {
    this.eventEmitter.emit('cleanData:start', data);
    const cleaned = [...new Set(data)];
    this.eventEmitter.emit('cleanData:success', cleaned);

    return cleaned;
  }

  on(event: `${ScraperEvents.BrowserStart}`, listener: () => void): void;
  on(event: `${ScraperEvents.BrowserClose}`, listener: () => void): void;
  on(event: `${ScraperEvents.Error}`, listener: (error: Error) => void): void;
  on(event: `${PageEvents.PageEnd}`, listener: (data: IRecord[]) => void): void;
  on(
    event: `${PageEvents.Page5Runs}`,
    listener: (data: IRecord[]) => void
  ): void;
  on(
    event: `${PageEvents.PageData}`,
    listener: (data: IRecord[]) => void
  ): void;
  on(event: `${PageEvents.PageNext}`, listener: (button: string) => void): void;
  on(event: `${PageEvents.PageScreenShot}`, listener: (screenshot: string | Buffer) => void): void;
  on(
    event: `${DataSaveEvents.DataSaveStart}`,
    listener: (data: IRecord[]) => void
  ): void;
  on(
    event: `${DataSaveEvents.DataSaveSuccess}`,
    listener: (data: IRecord[], filePath: string) => void
  ): void;
  on(
    event: `${ScraperEvents & PageEvents & DataSaveEvents}`,
    listener: (...args: any[]) => void
  ) {
    this.eventEmitter.on(event, listener);
  }

  emit(event: string, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }
}
