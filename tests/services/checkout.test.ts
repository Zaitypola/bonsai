import {createOrUpdateProduct} from "../../source/services/product";
import {initDb} from "../utils/db";
import {getCheckoutStoreProductsMock} from "../utils/mocks/checkout_store_products_mock";
import {checkout, checkoutCall, validateProducts} from "../../source/services/checkout"
import {errors} from "../../source/errors"

describe('Tests checkout services', () => {
    initDb();

    it('Tests store checkout call - api call works', async () => {
        const cart = {
            userId: 1,
            date: new Date(),
            products: [{
                productId: 1,
                quantity: 2
            }]
        }

        const checkoutCallMock = getCheckoutStoreProductsMock()

        try {
            await checkoutCall(cart)
            checkoutCallMock.done()
        } catch(error) {
            expect(error).toBeNull()
        }
    })

    it('Tests store checkout call - api call fails', async () => {
        const cart = {
            userId: 1,
            date: new Date(),
            products: [{
                productId: 1,
                quantity: 2
            }]
        }

        const response = {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }

        const checkoutCallMock = getCheckoutStoreProductsMock(response)

        try {
            await checkoutCall(cart)
        } catch(error) {
            checkoutCallMock.done()
            expect(error).toEqual(errors.ERROR_CHECKING_OUT)
        }
    })

    it('Tests validate products - all exist', async () => {
        const cartProducts = [
            {productId: 1, quantity: 2},
            {productId: 2, quantity: 4}]

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

        try {
            await validateProducts(cartProducts)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Tests validate products - some are missing', async () => {
        const cartProducts = [
            {productId: 1, quantity: 2},
            {productId: 2, quantity: 4},
            {productId: 7, quantity: 3},
            {productId: 10, quantity: 3},
            {productId: 12, quantity: 3}]

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

        const missingProducts = [
            {
                productId: 7
            },
            {
                productId: 10
            },
            {
                productId: 12
            }]

        try {
            await validateProducts(cartProducts)
        } catch (error) {
            expect(error).toMatchObject(errors.CHECKOUT_MISSING_PRODUCTS(missingProducts))
        }
    })

    it('Tests checkout - all products are found', async () => {
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

        const response = {
            statusCode: 200,
            body: {
                _id: 'any-id',
                id: 5,
                date: 'any-date',
                products: [
                    {productId: 1, quantity: 2}
                ]
            }
        }

        const checkoutCallMock = getCheckoutStoreProductsMock(response)

        const cart = {
            userId: 1,
            date: new Date(),
            products: [{
                productId: 1,
                quantity: 2
            }]
        }

        try {
            const data = await checkout(cart)

            expect(data).toMatchObject(response.body)
            checkoutCallMock.done()
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Tests checkout - products are not found', async () => {
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

        const response = {
            statusCode: 200,
            body: [1]
        }

        const checkoutCallMock = getCheckoutStoreProductsMock(response)

        const cart = {
            userId: 1,
            date: new Date(),
            products: [{
                productId: 3,
                quantity: 2
            }]
        }

        const missingProducts = [
            {
                productId: 3
            }]

        try {
            await checkout(cart)
        } catch (error) {
            checkoutCallMock.done()
            expect(error).toEqual(errors.CHECKOUT_MISSING_PRODUCTS(missingProducts))
        }
    })

    it('Tests checkout - call to checkout fails', async () => {
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

        const response = {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }

        const checkoutCallMock = getCheckoutStoreProductsMock(response)

        const cart = {
            userId: 1,
            date: new Date(),
            products: [{
                productId: 1,
                quantity: 2
            }]
        }

        try {
            await checkout(cart)
        } catch (error) {
            checkoutCallMock.done()
            expect(error).toEqual(errors.ERROR_CHECKING_OUT)
        }
    })
})