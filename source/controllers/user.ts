import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as userService from '../services/user';

export const syncEvenUsers = async (_req: Request, res: Response): Promise<void> => {
  await userService.syncEvenUsers();
  res.sendStatus(httpStatus.OK);
};
