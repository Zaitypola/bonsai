import { errors } from '../../source/errors';
import { createOrUpdateProduct } from '../../source/services/product';
import { checkout } from '../utils/api/checkout';
import { getCheckoutStoreProductsMock } from '../utils/mocks/checkout_store_products_mock';
import { nockHooks } from '../utils/nock_hooks';
import { serviceHooks } from '../utils/service_hooks';

describe('Tests checkout feature', () => {
  serviceHooks();
  nockHooks();

  it('Tests checkout feature - all products are found - external call works', async () => {
    const cart = {
      userId: 1,
      date: new Date(),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ],
    };

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

    const response = {
      statusCode: 200,
      body: {
        _id: 'any-id',
        id: 6,
        date: 'any-date',
        products: [
          { _id: 'any-id', productId: 1, quantity: 2 },
          { _id: 'any-id', productId: 2, quantity: 3 },
        ],
      },
    };

    const checkoutCallMock = getCheckoutStoreProductsMock(response);

    const { status, data } = await checkout(cart);

    checkoutCallMock.done();
    expect(status).toEqual(200);
    expect(data).toMatchObject({
      _id: expect.any(String),
      id: expect.any(Number),
      date: expect.any(String),
      products: [
        { _id: expect.any(String), productId: 1, quantity: 2 },
        { _id: expect.any(String), productId: 2, quantity: 3 },
      ],
    });
  });

  it('Tests checkout feature - some products are not found - external call works', async () => {
    const cart = {
      userId: 1,
      date: new Date(),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 77, quantity: 3 },
      ],
    };

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

    const missingProducts = [{ productId: 77 }];

    const { status, data } = await checkout(cart);

    expect(status).toEqual(400);
    expect(data).toMatchObject(errors.CHECKOUT_MISSING_PRODUCTS(missingProducts));
  });

  it('Tests checkout feature - external call does not work', async () => {
    const cart = {
      userId: 1,
      date: new Date(),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ],
    };

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

    const response = {
      statusCode: 500,
      body: {
        error: 'Internal server error',
      },
    };

    const checkoutCallMock = getCheckoutStoreProductsMock(response);

    const { status, data } = await checkout(cart);

    checkoutCallMock.done();
    expect(status).toEqual(500);
    expect(data).toMatchObject(errors.ERROR_CHECKING_OUT);
  });

  it('Tests checkout feature - invalid body', async () => {
    const cart = {
      userId: 1,
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ],
    } as any;

    const { status, data } = await checkout(cart);

    expect(status).toEqual(400);
    expect(data.errors.length).toEqual(1);
    expect(data.errors.some((error) => error.message.includes('date'))).toEqual(true);
  });
});
