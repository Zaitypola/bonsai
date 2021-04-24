import { MongoMemoryServer } from 'mongodb-memory-server';

import { openDbConnection, closeDbConnection } from '../../source/utils/db';

const mongod = new MongoMemoryServer();

/**
 * Sets up clean database.
 */
export const setupDB = async (): Promise<void> => {
  const uri = await mongod.getUri();
  await openDbConnection(uri);
};

/**
 * Clears database.
 */
export const teardownDB = async (): Promise<void> => {
  await closeDbConnection();
  await mongod.stop();
};

/**
 * Initializes when running tests with hooks.
 */
export const initDb = (): void => {
  beforeAll(setupDB);
  afterAll(teardownDB);
};
