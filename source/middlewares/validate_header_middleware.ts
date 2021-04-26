import { NextFunction, Request, Response } from "express";
import * as httpStatus from "http-status";

export const validateHeader = (expectedHeader: string) => (req: Request, res: Response, next: NextFunction) => {
    const header = req.header(expectedHeader)

    if (header && header.length > 0) {
        console.log(`Header ${expectedHeader} is valid`)
        return next()
    }

    res.status(httpStatus.BAD_REQUEST).json(`Header ${expectedHeader} missing in request`)
}