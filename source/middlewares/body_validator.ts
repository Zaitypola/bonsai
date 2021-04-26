'use strict'

import Ajv from 'ajv'

const validator = new Ajv({ allErrors: true })

import {NextFunction, Request, Response} from "express";
import * as httpStatus from "http-status";

export const bodyValidator = schema => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body

    const validate = validator.compile(schema)

    const valid = validate(body)

    if (valid) {
        return next()
    } else {
        console.log('Error in validation', validate.errors)

        res.status(httpStatus.BAD_REQUEST).json({ errors: validate.errors })
    }
}