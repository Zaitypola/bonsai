import { Application } from 'express';

import { checkout } from '../controllers/checkout';
import { getProducts, syncProducts, getProductByPublicId } from '../controllers/product';
import { syncEvenUsers } from '../controllers/user';
import {validateHeader} from "../middlewares/validate_header_middleware";

export const setupRoutes = (app: Application): void => {
  app
    .post('/checkout', checkout)
    .get('/products', validateHeader('BonsaiDeveloper'), getProducts)
    .get('/products/:public_id', validateHeader('BonsaiDeveloper'), getProductByPublicId)
    .post('/products/sync', validateHeader('BonsaiDeveloper'), syncProducts)
    .post('/users/sync', syncEvenUsers);
};
