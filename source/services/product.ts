import axios from 'axios';

import { STORE_URL } from '../constants';
import { InputModel } from '../interfaces';
import { dBProduct, Product } from '../models/product';

/**
 * Creates new product into our database.
 * @param {object} values - Insert values for new product.
 */
export const createProduct = (values: InputModel<Product>): Promise<Product> =>
  dBProduct.create(values);

/**
 * Returns list of existing products from E-Commerce Store.
 */
export const fetchProducts = async (): Promise<IProduct[]> => {
  const { data } = await axios.get(`${STORE_URL}/products`);
  return data;
};

/**
 * Returns all existing products from our database.
 */
export const getProducts = async (): Promise<Product[]> => await dBProduct.find();

/**
 * Synchronizes products from the external store into our database.
 */
export const syncProducts = async (): Promise<void> => {
  const products = await fetchProducts();

  products.forEach((product) => {
    createProduct({
      publicId: product.id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  });
};

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
