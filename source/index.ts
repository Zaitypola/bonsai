import bodyParser from 'body-parser';
import express from 'express';

import { setupRoutes } from './routes';
import { openDbConnection } from './utils/db';

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set up Express.js routes
setupRoutes(app);

// Open database connection to MongoDB
openDbConnection();

app.listen('4000', () => console.info('Bonsai Shop Node.js API running on port 4000'));
