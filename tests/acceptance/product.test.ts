import * as httpStatus from 'http-status';

import { errors } from '../../source/errors';
import { createOrUpdateProduct, getProducts } from '../../source/services/product';
import { getProductService } from '../utils/api/get_product';
import { getProductsService } from '../utils/api/get_products';
import { syncProductsService } from '../utils/api/sync_products';
import { getStoreProductsNock } from '../utils/mocks/get_store_products_mock';
import { nockHooks } from '../utils/nock_hooks';
import { serviceHooks } from '../utils/service_hooks';

describe('Tests the product services', () => {
  serviceHooks();
  nockHooks();

  it('Tests get one product service', async () => {
    const createdProduct = await createOrUpdateProduct({
      publicId: '1',
      title: 'Initial product',
      price: 9.99,
      description: 'First product ever inserted',
      category: 'Misc',
    });

    const { publicId } = createdProduct;

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductService(publicId, headers);

    expect(status).toEqual(httpStatus.OK);
    expect(data.publicId).toEqual(createdProduct.publicId);
  });

  it('Tests get one product service - not found', async () => {
    const publicId = '5';
    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductService(publicId, headers);

    expect(status).toEqual(httpStatus.NOT_FOUND);
    expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND);
  });

  it('Tests get all products service', async () => {
    await Promise.all([
      createOrUpdateProduct({
        publicId: '1',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'A',
      }),
      createOrUpdateProduct({
        publicId: '2',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'A',
      }),
      createOrUpdateProduct({
        publicId: '3',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'B',
      }),
      createOrUpdateProduct({
        publicId: '4',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'C',
      }),
    ]);

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductsService({}, headers);

    expect(status).toEqual(httpStatus.OK);
    expect(data.length).toEqual(4);
  });

  it('Tests get all products service - no results', async () => {
    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductsService({}, headers);

    expect(status).toEqual(httpStatus.NOT_FOUND);
    expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND);
  });

  it('Tests get all products service - filtered', async () => {
    await Promise.all([
      createOrUpdateProduct({
        publicId: '1',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'A',
      }),
      createOrUpdateProduct({
        publicId: '2',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'A',
      }),
      createOrUpdateProduct({
        publicId: '3',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'B',
      }),
      createOrUpdateProduct({
        publicId: '4',
        title: 'Initial product',
        price: 9.99,
        description: 'First product ever inserted',
        category: 'C',
      }),
    ]);

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductsService({ category: 'C' }, headers);

    expect(status).toEqual(httpStatus.OK);
    expect(data.length).toEqual(1);
  });

  it('Tests get all products service - filtered - no results', async () => {
    await createOrUpdateProduct({
      publicId: '1',
      title: 'Initial product',
      price: 9.99,
      description: 'First product ever inserted',
      category: 'A',
    });

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status, data } = await getProductsService({ category: 'C' }, headers);

    expect(status).toEqual(httpStatus.NOT_FOUND);
    expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND);
  });

  it('Tests product sync - call to store API works - local db empty', async () => {
    const storeProducts = [
      {
        id: 1,
        title: 'Title',
        price: 12,
        description: 'Desc',
        category: 'A',
        image: 'image',
      },
      {
        id: 2,
        title: 'Title',
        price: 9.99,
        description: 'Desc',
        category: 'A',
        image: 'image',
      },
      {
        id: 3,
        title: 'Title',
        price: 9.99,
        description: 'description',
        category: 'A',
        image: 'img',
      },
    ];

    const response = {
      statusCode: 200,
      body: storeProducts,
    };

    const getProductsMock = getStoreProductsNock(response);

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status } = await syncProductsService(headers);

    const allProducts = await getProducts();

    getProductsMock.done();
    expect(status).toEqual(200);
    expect(allProducts.length).toEqual(3);
  });

  it('Tests product sync - call to store API works - updates one', async () => {
    const storeProducts = [
      {
        id: 1,
        title: 'Title',
        price: 99,
        description: 'New desc.',
        category: 'A',
        image: 'image',
      },
      {
        id: 2,
        title: 'Title',
        price: 9.99,
        description: 'Desc',
        category: 'A',
        image: 'image',
      },
      {
        id: 3,
        title: 'Title',
        price: 9.99,
        description: 'description',
        category: 'A',
        image: 'img',
      },
    ];

    const response = {
      statusCode: 200,
      body: storeProducts,
    };

    const storedProduct = await createOrUpdateProduct({
      publicId: '1',
      title: 'Initial product',
      price: 9.99,
      description: 'First product ever inserted',
      category: 'A',
    });

    const getProductsMock = getStoreProductsNock(response);

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status } = await syncProductsService(headers);

    const allProducts = await getProducts();

    const updatedProduct = allProducts.find((product) => product._id === storedProduct._id);
    const createdProducts = allProducts.filter((product) => product._id !== storedProduct._id);

    getProductsMock.done();
    expect(status).toEqual(200);
    expect(allProducts.length).toEqual(3);

    /*
     * New price was updated for the already created product.
     *
     * */
    expect(updatedProduct!.price).toEqual(99);

    /*
     * Iterates over each of the created products (not updated) and
     * checks that all of them have the store values.
     * */
    createdProducts.forEach((product) => {
      const storeProduct = storeProducts.find(
        (storeProduct) => storeProduct.id.toString() === product.publicId,
      );

      expect({
        price: storeProduct!.price,
        category: storeProduct!.category,
        title: storeProduct!.title,
      }).toMatchObject({
        price: product.price,
        category: product.category,
        title: product.title,
      });
    });
  });

  it('Tests product sync service - call to store API does not work', async () => {
    const response = {
      statusCode: 500,
      body: {
        error: 'Internal server error',
      },
    };

    const getProductsMock = getStoreProductsNock(response);

    const headers = {
      BonsaiDeveloper: 'Jorge Calvo Martin',
    };

    const { status } = await syncProductsService(headers);

    getProductsMock.done();
    expect(status).toEqual(500);
  });

  it('Tests get all products service - no headers', async () => {
    const { status } = await getProductsService({ category: 'C' });

    expect(status).toEqual(httpStatus.BAD_REQUEST);
  });
});
