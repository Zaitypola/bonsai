import axios from 'axios';

import { STORE_URL } from '../constants';
import { InputModel } from '../interfaces';
import { dBProduct, Product } from '../models/product';
import { errors } from "../errors";

/**
 * Creates new product into our database.
 * @param {object} values - Insert values for new product.
 */
export const createOrUpdateProduct = async (values: InputModel<Product>): Promise<Product> => {
 return await dBProduct.findOneAndUpdate({ publicId: values.publicId }, values, { new: true, upsert: true, setDefaultsOnInsert: true })
}


/**
 * Returns list of existing products from E-Commerce Store.
 */
export const fetchProducts = async (): Promise<IProduct[]> => {
  try {
    const { data } = await axios.get(`${STORE_URL}/products`);
    return data;
  } catch (error) {
   console.log('Error fetching products')
   throw errors.ERROR_FETCHING_PRODUCTS
  }
};

/**
 * Returns all existing products from our database.
 */
export const getProducts = async (query = {}): Promise<Product[]> => {
  const products = await dBProduct.find(query);

  if (products.length < 1) throw errors.RESOURCE_NOT_FOUND

  return products
}


/**
 * Returns one product from the database with a query.
 */
export const getOneProduct = async (query): Promise<Product> => {
    const product = await dBProduct.findOne(query);

    if (!product) throw errors.RESOURCE_NOT_FOUND

    return product
}

/**
 * Synchronizes products from the external store into our database.
 */
export const syncProducts = async (): Promise<void> => {
  const products = await fetchProducts();

  await updateProducts(products)
};

/**
 * Updates products returned from the store API.
 */
export const updateProducts = async (products: IProduct[]) => {
    await Promise.all(products.map(product => createOrUpdateProduct({
            publicId: product.id.toString(),
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image
        })
    ))
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
