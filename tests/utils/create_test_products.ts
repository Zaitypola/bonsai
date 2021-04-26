import { createOrUpdateProduct } from '../../source/services/product';

export const createTestProducts = async (numProducts) =>
  Promise.all(
    Array.from({ length: numProducts }, (_, index) => index + 1).map((value) =>
      createOrUpdateProduct({
        publicId: String(value),
        title: 'Test',
        price: 9.99,
        description: 'Test',
        category: 'Misc',
      }),
    ),
  );
