import {
    createOrUpdateProduct,
    fetchProducts,
    getOneProduct,
    getProducts, syncProducts,
    updateProducts
} from "../../source/services/product";
import {initDb} from "../utils/db";
import {createTestProducts} from '../utils/create_test_products';
import {getStoreProductsNock} from "../utils/mocks/get_store_products_mock";
import {errors} from "../../source/errors";
import {nockHooks} from "../utils/nock_hooks";

describe('Product services', () => {
    initDb();
    nockHooks();

    it('Gets one product', async () => {
        try {
            const createdProduct = await createOrUpdateProduct({
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

    it('Gets all products - filter by category', async () => {
        try {
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
                })
            ])

            const query = {
                category: 'A'
            }

            const foundProducts = await getProducts(query)

            expect(foundProducts.length).toEqual(2)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Creates product', async () => {
        try {
            const createdProduct = await createOrUpdateProduct({
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

    it('Fetches products - external call works', async () => {
        const getProductsMock = getStoreProductsNock()

        try {
            await fetchProducts()

            getProductsMock.done()
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Fetches products - external call does not work', async () => {
        const response = {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }

        const getProductsMock = getStoreProductsNock(response)

        try {
            await fetchProducts()
        } catch (error) {
            expect(error).toMatchObject(errors.ERROR_FETCHING_PRODUCTS)
            getProductsMock.done()
        }
    })

    it('Updates products from the store API - local db is empty', async () => {
        const storeProducts = [{
            id: 1,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 2,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 3,
            title: 'Title',
            price: 9.99,
            description: 'description',
            category: 'A',
            image: 'img'
        }]

        await updateProducts(storeProducts)

        const allProducts = await getProducts()

        expect(allProducts.length).toEqual(3)
    })

    it('Updates products from the store API - product gets updated', async () => {
        const storeProducts = [{
            id: 1,
            title: 'Title',
            price: 12,
            description: 'New description',
            category: 'A',
            image: 'image'
        }, {
            id: 2,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 3,
            title: 'Title',
            price: 9.99,
            description: 'description',
            category: 'A',
            image: 'img'
        }]

        const storedProduct = await createOrUpdateProduct({
            publicId: storeProducts[0].id.toString(),
            title: storeProducts[0].title,
            price: 9.99,
            description: 'Previous description',
            category: 'A',
        })

        await updateProducts(storeProducts)

        const allProducts = await getProducts()

        expect(allProducts.length).toEqual(3)

        const updatedProduct = await getOneProduct({_id: storedProduct._id})

        expect(updatedProduct.price).toEqual(12)
        expect(updatedProduct.description).toEqual('New description')
    })

    it('Syncs products - empty db', async () => {
        const storeProducts = [{
            id: 1,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 2,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 3,
            title: 'Title',
            price: 9.99,
            description: 'description',
            category: 'A',
            image: 'img'
        }]

        const response = {
            statusCode: 200,
            body: storeProducts
        }

        const getProductsMock = getStoreProductsNock(response)

        try {
            await syncProducts()

            const storedProducts = await getProducts()

            expect(storedProducts.length).toEqual(3)
            getProductsMock.done()
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Syncs products - updates stored product', async () => {
        const storeProducts = [{
            id: 1,
            title: 'Title',
            price: 12,
            description: 'New desc.',
            category: 'A',
            image: 'image'
        }, {
            id: 2,
            title: 'Title',
            price: 9.99,
            description: 'Desc',
            category: 'A',
            image: 'image'
        }, {
            id: 3,
            title: 'Title',
            price: 9.99,
            description: 'description',
            category: 'A',
            image: 'img'
        }]

        const response = {
            statusCode: 200,
            body: storeProducts
        }

        const getProductsMock = getStoreProductsNock(response)

        try {
            const storedProduct = await createOrUpdateProduct({
                publicId: storeProducts[0].id.toString(),
                title: storeProducts[0].title,
                price: 9.99,
                description: 'Previous description',
                category: 'A',
            })

            await syncProducts()

            const updatedProduct = await getOneProduct({ _id: storedProduct._id })

            expect(updatedProduct.price).toEqual(12)
            expect(updatedProduct.description).toEqual('New desc.')
            getProductsMock.done()
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Syncs products - call to fetch products fails', async () => {
        const response = {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }

        const getProductsMock = getStoreProductsNock(response)

        try {
            await syncProducts()
        } catch (error) {
            expect(error).toMatchObject(errors.ERROR_FETCHING_PRODUCTS)
            getProductsMock.done()
        }
    })
})