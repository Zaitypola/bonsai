import nock from 'nock'
import { STORE_URL } from "../../../source/constants";

export const getFetchUserMock = (publicId: number, response: IMockedResponse = { statusCode: 200, body: {}}) => {
    return nock(STORE_URL)
        .get(`/users/${publicId}`)
        .reply(response.statusCode, response.body)
}

interface IMockedResponse {
    statusCode: number,
    body?: any
}