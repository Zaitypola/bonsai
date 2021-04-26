import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as checkoutService from '../services/checkout';

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
      const checkout = await checkoutService.checkout(req.body);
      res.status(httpStatus.OK).json(checkout);
  } catch (error) {
     console.log('Error checking out', error)
     res.status(error.statusCode).json(error)
  }
};
