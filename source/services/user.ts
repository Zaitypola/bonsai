import axios from 'axios';

import { STORE_URL } from '../constants';
import { errors } from '../errors';
import { InputModel } from '../interfaces';
import { dbUser, User } from '../models/user';

/**
 * Interface of users returned by the API.
 */
export interface IUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
}

/**
 * Creates user.
 * @param {InputModel<User>} user - Input to create user.
 * @returns {Promise<User>} - Returns user created.
 */
export const createUser = async (user: InputModel<User>): Promise<User> =>
  await dbUser.create(user);

/**
 * Finds one user.
 * @param query - Query to find one user.
 * @returns {Promise<User>} - Returns user found. Throws exception if user not found.
 */
export const findOneUser = async (query: Record<string, unknown>): Promise<User> => {
  const user = await dbUser.findOne(query);

  if (!user) {
    throw errors.USER_NOT_FOUND;
  }

  return user;
};

/**
 * Returns existing user by its id from E-Commerce Store.
 * @param {number} id - Public id in the store.
 * @returns {Promise<IUser>} - Returns user found in store.
 */
export const fetchUserById = async (id: number): Promise<IUser> => {
  try {
    const { data } = await axios.get(`${STORE_URL}/users/${id}`);
    return data;
  } catch {
    console.log('Error calling API sync user');
    throw errors.ERROR_SYNC_USER_CALL;
  }
};

/**
 * Finds first 8 even users. In the exercise, it is not specified if they are the
 * first 8 that are created in the databse or the first 8 in order.
 * @returns {Promise<User[]>} - Returns the list of first 8 even users.
 */
export const getEvenUsers = async (): Promise<User[]> => {
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  const query = {
    publicId: {
      $mod: [2, 0],
    },
  };

  /* eslint-disable unicorn/no-fn-reference-in-iterator */
  return await dbUser.find(query).limit(8);
};

/**
 * Syncs a single user.
 * Removes the id field coming from the store API to avoid conflicts.
 * @param {User} user - User to sync.
 * @returns {Promise<void>}
 */
export const syncUser = async (user: User): Promise<void> => {
  const storeUser: Omit<IUser, 'id'> = await fetchUserById(user.publicId);

  await dbUser.updateOne({ _id: user._id }, { $set: storeUser });
};

/***
 * Syncs all users provided.
 * All users provided will be updated with the info from the API.
 * @param {User[]} users - Users to be synced.
 * @returns {Promise<void>}
 */
export const syncUsers = async (users: User[]): Promise<void> => {
  await Promise.all(users.map((user) => syncUser(user)));
};

/**
 * Synchronizes all user with an even id.
 */
export const syncEvenUsers = async (): Promise<void> => {
  const users = await getEvenUsers();
  await syncUsers(users);
};
