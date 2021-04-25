import * as httpStatus from "http-status";
import { createProduct } from "../../source/services/product";
import { getProductService } from "../utils/api/get_product";
import { getProductsService } from "../utils/api/get_products";
import { serviceHooks } from "../utils/service_hooks";
import { errors } from "../../source/errors";


describe('Tests the product services', () => {
    serviceHooks();

    it('Tests get one product service', async () => {
        const createdProduct = await createProduct({
            publicId: '1',
            title: 'Initial product',
            price: 9.99,
            description: 'First product ever inserted',
            category: 'Misc',
        });
        const publicId = createdProduct.publicId;
        const {status, data} = await getProductService(publicId);

        expect(status).toEqual(httpStatus.OK);
        expect(data.publicId).toEqual(createdProduct.publicId);
    })

    it('Tests get one product service - not found', async () => {
        const publicId = '5';
        const {status, data} = await getProductService(publicId);

        expect(status).toEqual(httpStatus.NOT_FOUND);
        expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND);
    })

    it('Tests get all products service', async () => {
        await Promise.all([
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'A',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'A',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'B',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'C',
            })
        ])

        const {status, data} = await getProductsService();

        expect(status).toEqual(httpStatus.OK);
        expect(data.length).toEqual(4);
    })

    it('Tests get all products service - no results', async () => {
        const {status, data} = await getProductsService();

        expect(status).toEqual(httpStatus.NOT_FOUND);
        expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND)
    })

    it('Tests get all products service - filtered', async () => {
        await Promise.all([
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'A',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'A',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'B',
            }),
            createProduct({
                publicId: '1',
                title: 'Initial product',
                price: 9.99,
                description: 'First product ever inserted',
                category: 'C',
            })
        ])

        const {status, data} = await getProductsService({ category: 'C' });

        expect(status).toEqual(httpStatus.OK);
        expect(data.length).toEqual(1);
    })

    it('Tests get all products service - filtered - no results', async () => {
        await createProduct({
            publicId: '1',
            title: 'Initial product',
            price: 9.99,
            description: 'First product ever inserted',
            category: 'A',
        })

        const {status, data} = await getProductsService({ category: 'C' });

        expect(status).toEqual(httpStatus.NOT_FOUND);
        expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND);
    })
})