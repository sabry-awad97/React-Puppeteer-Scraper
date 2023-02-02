import mongoose, { Schema } from 'mongoose';
import { IRecord } from '../types';

export const recordSchema = new Schema<IRecord>(
  {
    url: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

const Record = mongoose.model('Record', recordSchema);

export default Record;
