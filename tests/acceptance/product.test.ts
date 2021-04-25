import {createProduct} from "../../source/services/product";
import {getProductService} from "../utils/api/get_product";
import {serviceHooks} from "../utils/service_hooks";
import {errors} from '../../source/errors'


describe('Tests the product services', () => {
    serviceHooks()

    it('Tests get one product service', async () => {
        const createdProduct = await createProduct({
            publicId: '1',
            title: 'Initial product',
            price: 9.99,
            description: 'First product ever inserted',
            category: 'Misc',
        })
        const publicId = createdProduct.publicId
        const {status, data} = await getProductService(publicId)

        expect(status).toEqual(200)
        expect(data.publicId).toEqual(createdProduct.publicId)
    })

    it('Tests get one product service - not found', async () => {
        const publicId = '5'
        const {status, data} = await getProductService(publicId)

        expect(status).toEqual(status)
        expect(data).toMatchObject(errors.RESOURCE_NOT_FOUND)
    })
})