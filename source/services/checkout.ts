import axios from 'axios';

import { STORE_URL } from '../constants';

/**
 * Creates a new cart used for checkout.
 * @param {object} values - Cart values.
 */
export const checkout = async (values: ICreateCart): Promise<ICart> => {
  const { data } = await axios.post(`${STORE_URL}/carts`, values);
  return data;
};

export interface ICreateCart {
  userId: number;
  date: Date;
  products: {
    productId: number;
    quantity: number;
  }[];
}

export interface ICart extends ICreateCart {
  id: number;
}
