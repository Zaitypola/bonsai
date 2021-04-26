import axios from 'axios';

import { STORE_URL } from '../constants';
import {errors} from "../errors";
import {InputModel} from "../interfaces";
import {dbUser, User} from "../models/user";

/**
 * Creates user.
 * @param {InputModel<User>} user
 * @returns {Promise<User>}
 */
export const createUser = async (user: InputModel<User>): Promise<User> => {
  return await dbUser.create(user)
}

/**
 * Finds one user.
 * @param query
 * @returns {Promise<User>}
 */
export const findOneUser = async (query: any): Promise<User> => {
  const user = await dbUser.findOne(query)

  if (!user) throw errors.USER_NOT_FOUND

  return user
}

/**
 * Returns existing user by its id from E-Commerce Store.
 */
export const fetchUserById = async (id: number): Promise<IUser> => {
  try {
    const { data } = await axios.get(`${STORE_URL}/users/${id}`);
    return data;
  } catch (error) {
      console.log('Error calling API sync user')
      throw errors.ERROR_SYNC_USER_CALL
  }
};

/**
 * Synchronizes all user with an even id.
 */
export const syncEvenUsers = async (): Promise<void> => {
  const users = await getEvenUsers()
  await syncUsers(users)
}

/***
 * Syncs all users provided.
 * @param {User[]} users
 * @returns {Promise<void>}
 */
export const syncUsers = async (users: User[]): Promise<void> => {
  await Promise.all(users.map(user => syncUser(user)))
}

/**
 * Syncs a single user.
 * Removes the id field coming from the store API to avoid conflicts.
 * @param {User} user
 * @returns {Promise<void>}
 */
export const syncUser = async(user: User): Promise<void> => {
  const {id, ...userData} = await fetchUserById(user.publicId)

  await dbUser.updateOne({ _id: user._id }, { $set: userData })
}

/**
 * Finds first 8 even users. In the exercise, it is not specified if they are the
 * first 8 that are created in the databse or the first 8 in order.
 * @returns {Promise<User[]>}
 */
export const getEvenUsers = async (): Promise<User[]> => {
  return await dbUser.find({ publicId: { $mod: [2, 0] } }).limit(8)
}

/**
 * Interface of users returned by the API.
 */
export interface IUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
}
