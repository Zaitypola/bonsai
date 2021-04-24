import axios from 'axios';

import { STORE_URL } from '../constants';

/**
 * Returns existing user by its id from E-Commerce Store.
 */
export const fetchUserById = async (id: string): Promise<IUser[]> => {
  const { data } = await axios.get(`${STORE_URL}/users/${id}`);
  return data;
};

/**
 * Synchronizes all user with an even id.
 * @todo Implement the actual functionality.
 */
export const syncEvenUsers = (): Promise<void> => Promise.resolve();

export interface IUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
}
