import * as httpStatus from "http-status";

export const errors = {
    RESOURCE_NOT_FOUND: {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Resource was not found',
        name: 'RESOURCE_NOT_FOUND'
    }
}