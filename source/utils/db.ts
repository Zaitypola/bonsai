import mongoose from 'mongoose';

import { DB_URL } from '../constants';

export const openDbConnection = async (uri?: string): Promise<void> => {
  await mongoose.connect(uri || DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.info('Connected to Mongo database!');
};

/**
 * Closes default mongoose connection.
 */
export const closeDbConnection = (): Promise<void> => {
  if (mongoose.connection) {
    return mongoose.connection.close();
  }
  throw new Error('Trying to close a DB connection that is not open');
};
