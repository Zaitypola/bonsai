import nock from 'nock';

import { STORE_URL } from '../../../source/constants';

export const getCheckoutStoreProductsMock = (
  response: IMockedResponse = { statusCode: 200, body: {} },
) => nock(STORE_URL).post('/carts').reply(response.statusCode, response.body);

interface IMockedResponse {
  statusCode: number;
  body: any;
}
