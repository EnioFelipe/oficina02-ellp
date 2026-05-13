import { validationResult } from 'express-validator';

export function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next({
      statusCode: 422,
      message: 'Dados invalidos',
      errors: result.array()
    });
  }

  next();
}
