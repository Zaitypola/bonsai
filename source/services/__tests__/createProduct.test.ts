import { initDb } from '../../../tests/utils/db';
import { createProduct } from '../product';

describe('createProduct', () => {
  initDb();

  it('Should create a new product', async () => {
    const createdProduct = await createProduct({
      publicId: '12',
      title: 'What a product',
      price: 12.99,
      description: 'This is the most amazing product ever!',
      category: 'Watches',
    });

    expect(createdProduct).toMatchObject({
      _id: expect.any(String),
      publicId: '12',
    });
  });
});
