import mongoose from 'mongoose';
import { IRecord } from '../types/index.js';
import Record from './Model.js';

export class Database {
  connection = mongoose.connection;

  constructor() {
    try {
      this.connection
        .once('open', () => console.log('Database connection: open'))
        .on('close', () => console.log('Database connection: close'))
        .on('disconnected', () =>
          console.log('Database connection: disconnected')
        )
        .on('reconnected', () =>
          console.log('Database connection: reconnected')
        )
        .on('fullsetup', () => console.log('Database connection: fullsetup'))
        .on('all', () => console.log('Database connection: all'))
        .on('error', error =>
          console.error('MongoDB connection: error: ', error)
        );
    } catch (error) {
      throw error;
    }
  }

  async connect(dbName: string) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(`mongodb://0.0.0.0:27017/${dbName}`);
    } catch (error) {
      console.error(error);
    }
  }

  async saveRecords(data: IRecord[]) {
    for (const record of data) {
      try {
        const found = await Record.findOne(record);
        if (!found) {
          record['lastUpdated'] = new Date().toLocaleString();
          await Record.create(record);
        }
      } catch (err: any) {
        throw new Error(`Error saving record to the database: ${err}`);
      }
    }
  }

  async disconnect() {
    try {
      await this.connection.close();
    } catch (error) {
      console.error(error);
    }
  }
}

const database = new Database();

process.on('SIGINT', async () => {
  await database.disconnect();

  process.exit(0);
});

export default database;
