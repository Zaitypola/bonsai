import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as userService from '../services/user';

export const syncEvenUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    await userService.syncEvenUsers();
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log('Error when syncing users');
    res.status(error.statusCode).json(error);
  }
};
