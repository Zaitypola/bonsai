import { Application } from 'express';

import { checkout } from '../controllers/checkout';
import { getProducts, syncProducts, getProductByPublicId } from '../controllers/product';
import { syncEvenUsers } from '../controllers/user';
import { bodyValidator } from '../middlewares/body_validator';
import { validateHeader } from '../middlewares/validate_header_middleware';
import { checkoutBodySchema } from '../schemas/checkout_body_schema';

export const setupRoutes = (app: Application): void => {
  app
    .post('/checkout', bodyValidator(checkoutBodySchema), checkout)
    .get('/products', validateHeader('BonsaiDeveloper'), getProducts)
    .get('/products/:public_id', validateHeader('BonsaiDeveloper'), getProductByPublicId)
    .post('/products/sync', validateHeader('BonsaiDeveloper'), syncProducts)
    .post('/users/sync', syncEvenUsers);
};
