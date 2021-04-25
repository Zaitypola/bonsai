import {createProduct, getOneProduct, getProducts} from "../../source/services/product";
import {initDb} from "../utils/db";
import {createTestProducts} from '../utils/create_test_products';
import {errors} from "../../source/errors";

describe('Product services', () => {
    initDb();

    it('Gets one product', async () => {
        try {
            const createdProduct = await createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'Misc',
            })

            const foundProduct = await getOneProduct({publicId: createdProduct.publicId})

            expect(foundProduct._id).toEqual(createdProduct._id)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Gets one product - not found error', async () => {
        try {
            await getOneProduct({_id: 'any_id'})
        } catch (error) {
            expect(error).toMatchObject(errors.RESOURCE_NOT_FOUND)
        }
    })

    it('Gets all products', async () => {
        try {
            const numProducts = 5
            await createTestProducts(numProducts)
            const foundProducts = await getProducts()

            expect(foundProducts.length).toEqual(numProducts)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Creates product', async () => {
        try {
            const createdProduct = await createProduct({
                publicId: '12',
                title: 'What a product',
                price: 12.99,
                description: 'This is the most amazing product ever!',
                category: 'Watches',
            })

            expect(createdProduct).toMatchObject({
                _id: expect.any(String),
                publicId: '12',
            })
        } catch (error) {
            expect(error).toBeNull()
        }
    })
})