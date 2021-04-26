import axios from 'axios';

import { STORE_URL } from '../constants';
import {getOneProduct, IMissingProduct} from "./product";
import {errors} from "../errors";

/**
 * Creates a new cart used for checkout.
 * @param {object} values - Cart values.
 */
export const checkout = async (values: ICreateCart): Promise<ICart> => {
  await validateProducts(values.products)
  return await checkoutCall(values)
};

export const checkoutCall = async (values: ICreateCart): Promise<ICart> => {
  try {
    const { data } = await axios.post(`${STORE_URL}/carts`, values);
    return data;
  } catch (error) {
    console.log('Error calling checkout')
    throw errors.ERROR_CHECKING_OUT
  }
}

export const validateProducts = async (cartProducts: ICartProduct[]): Promise<void> => {
  const missingProducts: IMissingProduct[] = []

  await Promise.all(cartProducts.map(async cartProduct => {
    try {
        await getOneProduct({ publicId: cartProduct.productId.toString() })
    } catch (error) {
      missingProducts.push({ productId: cartProduct.productId })
    }
  }))

    if (missingProducts.length > 0) {
      throw errors.CHECKOUT_MISSING_PRODUCTS(missingProducts)
    }
}

export interface ICartProduct {
  productId: number;
  quantity: number;
}

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
