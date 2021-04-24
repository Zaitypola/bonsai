import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as productService from '../services/product';

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await productService.getProducts();
  res.status(httpStatus.OK).json(products);
};

export const syncProducts = (_req: Request, res: Response): void => {
  productService.syncProducts();
  res.sendStatus(httpStatus.OK);
};
