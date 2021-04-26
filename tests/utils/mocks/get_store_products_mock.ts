import nock from 'nock'
import { STORE_URL } from "../../../source/constants";

export const getStoreProductsNock = (response: IMockedResponse = { statusCode: 200, body: {}}) => {
    return nock(STORE_URL)
        .get('/products')
        .reply(response.statusCode, response.body)
}

interface IMockedResponse {
    statusCode: number,
    body: any
}