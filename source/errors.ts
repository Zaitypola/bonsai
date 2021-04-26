import * as httpStatus from "http-status";

export const errors = {
    RESOURCE_NOT_FOUND: {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Resource was not found',
        name: 'RESOURCE_NOT_FOUND'
    },
    ERROR_FETCHING_PRODUCTS: {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching products from store',
        name: 'ERROR_FETCHING_PRODUCTS'
    }
}