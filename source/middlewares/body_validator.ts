import Ajv from 'ajv';
import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { JSONSchema4 } from 'json-schema';

const validator = new Ajv({ allErrors: true });

export const bodyValidator = (schema: JSONSchema4) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { body } = req;

  const validate = validator.compile(schema);

  const valid = validate(body);

  if (valid) {
    return next();
  }
  console.log('Error in validation', validate.errors);

  res.status(httpStatus.BAD_REQUEST).json({ errors: validate.errors });
};
