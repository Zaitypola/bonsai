import bodyParser from 'body-parser';
import express from 'express';

import { setupRoutes } from './routes';
import { closeDbConnection, openDbConnection } from './utils/db';

let server;

export const startService = async (port: number): Promise<void> => {
  const app = express();

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // Parse application/json
  app.use(bodyParser.json());

  // Set up Express.js routes
  setupRoutes(app);

  await openDbConnection();
  server = await app.listen(port);

  console.info(`Bonsai Shop Node.js API running on port ${port}`);
};

export const stopService = async (): Promise<void> => {
  await closeDbConnection();
  await server.close();
};
