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

/**
 * Calls the API checkout service.
 * Throws exception if the call fails.
 * @param {ICreateCart} values
 * @returns {Promise<ICart>}
 */
export const checkoutCall = async (values: ICreateCart): Promise<ICart> => {
  try {
    const { data } = await axios.post(`${STORE_URL}/carts`, values);
    return data;
  } catch (error) {
    console.log('Error calling checkout')
    throw errors.ERROR_CHECKING_OUT
  }
}

/**
 * Validates product provided in the cart to checkout.
 * Requirements of how this service should fail are not specified.
 *
 * The function tries to find all products in the cart in the local db.
 * All that are missing are returned as an error.
 ** @param {ICartProduct[]} cartProducts
 * @returns {Promise<void>}
 */
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

/**
 * Interface of products to validate.
 */
export interface ICartProduct {
  productId: number;
  quantity: number;
}

/**
 * Interface to create a cart.
 */
export interface ICreateCart {
  userId: number;
  date: Date;
  products: ICartProduct[];
}

/**
 * Interface of cart that was returned by API.
 */
export interface ICart extends ICreateCart {
  id: number;
}
