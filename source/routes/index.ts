import { Application } from 'express';

import { checkout } from '../controllers/checkout';
import { getProducts, syncProducts, getProductByPublicId } from '../controllers/product';
import { syncEvenUsers } from '../controllers/user';

export const setupRoutes = (app: Application): void => {
  app
    .post('/checkout', checkout)
    .get('/products', getProducts)
    .get('/products/:public_id', getProductByPublicId)
    .post('/products/sync', syncProducts)
    .post('/users/sync', syncEvenUsers);
};
