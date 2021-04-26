import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as productService from '../services/product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { query } = req;

  try {
    const products = await productService.getProducts(query);
    res.status(httpStatus.OK).json(products);
  } catch (error) {
    console.log('Error fetching products', error);
    res.status(error.statusCode).json(error);
  }
};

export const syncProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    await productService.syncProducts();
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

export const getProductByPublicId = async (req: Request, res: Response): Promise<void> => {
  const {
    params: { public_id: publicId },
  } = req;

  try {
    const query = { publicId };
    const product = await productService.getOneProduct(query);
    console.log(`Product with id ${publicId} found`);

    res.status(httpStatus.OK).json(product);
  } catch (error) {
    console.log(`Error fetching product with public id ${publicId}`, error);
    res.status(error.statusCode).json(error);
  }
};
