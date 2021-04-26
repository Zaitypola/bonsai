import axios from 'axios';

import { STORE_URL } from '../constants';
import { errors } from '../errors';
import { InputModel } from '../interfaces';
import { dBProduct, Product } from '../models/product';

/**
 * Creates new product into our database.
 * @param {object} values - Insert values for new product.
 */
export const createOrUpdateProduct = async (values: InputModel<Product>): Promise<Product> =>
  await dBProduct.findOneAndUpdate({ publicId: values.publicId }, values, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

/**
 * Returns list of existing products from E-Commerce Store.
 */
export const fetchProducts = async (): Promise<IProduct[]> => {
  try {
    const { data } = await axios.get(`${STORE_URL}/products`);
    return data;
  } catch {
    console.log('Error fetching products');
    throw errors.ERROR_FETCHING_PRODUCTS;
  }
};

/**
 * Returns all existing products from our database.
 */
export const getProducts = async (query = {}): Promise<Product[]> => {
  /* eslint-disable unicorn/no-fn-reference-in-iterator */
  const products = await dBProduct.find(query);

  /* eslint-disable @typescript-eslint/no-magic-numbers */
  if (products.length === 0) {
    throw errors.RESOURCE_NOT_FOUND;
  }

  return products;
};

/**
 * Returns one product from the database with a query.
 */
export const getOneProduct = async (query: Record<string, unknown>): Promise<Product> => {
  const product = await dBProduct.findOne(query);

  if (!product) {
    throw errors.RESOURCE_NOT_FOUND;
  }

  return product;
};

/**
 * Updates products returned from the store API.
 */
export const updateProducts = async (products: IProduct[]): Promise<Product[]> =>
  await Promise.all(
    products.map((product) =>
      createOrUpdateProduct({
        publicId: product.id.toString(),
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      }),
    ),
  );

/**
 * Synchronizes products from the external store into our database.
 */
export const syncProducts = async (): Promise<void> => {
  const products = await fetchProducts();

  await updateProducts(products);
};

export interface IMissingProduct {
  productId: number;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
