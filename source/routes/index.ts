import { Application } from 'express';

import { checkout } from '../controllers/checkout';
import { getProducts, syncProducts } from '../controllers/product';
import { syncEvenUsers } from '../controllers/user';

export const setupRoutes = (app: Application): void => {
  app
    .post('/checkout', checkout)
    .get('/products', getProducts)
    .post('/products/sync', syncProducts)
    .post('/users/sync', syncEvenUsers);
};
