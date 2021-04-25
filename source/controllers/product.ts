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

export const getProductByPublicId = async (req: Request, res: Response): Promise<void> => {
    const {public_id: publicId} = req.params;

    try {
        const query = { publicId }
        const product = await productService.getOneProduct(query)
        console.log(`Product with id ${publicId} found`)

        res.status(httpStatus.OK).json(product);
    } catch (error) {
        console.log(`Error fetching product with public id ${publicId}`, error)
        res.status(error.statusCode).json(error)
    }
}
