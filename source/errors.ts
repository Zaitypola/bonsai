import * as httpStatus from "http-status";
import {IMissingProduct} from "./services/product";

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
    },
    CHECKOUT_MISSING_PRODUCTS: (missingProducts: IMissingProduct[]) => {
        return {
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Missing products on checkout',
            name: 'CHECKOUT_MISSING_PRODUCTS',
            data: missingProducts
        }
    },
    ERROR_CHECKING_OUT: {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error calling checkout store service',
        name: 'ERROR_FETCHING_PRODUCTS'
    },
    ERROR_SYNC_USER_CALL: {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error calling sync user API',
        name: 'ERROR_SYNC_USER_CALL'
    },
    USER_NOT_FOUND: {
        statusCode: httpStatus.NOT_FOUND,
        message: 'User not found',
        name: 'USER_NOT_FOUND'
    }
}