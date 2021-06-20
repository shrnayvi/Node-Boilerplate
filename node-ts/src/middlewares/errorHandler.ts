import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { IError } from '../interfaces/IError';

export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.code) {
    if (typeof err.code === 'number') {
      return res.status(err.code).send({
        message: err.message ? res.__(err.message) : res.__('internalServerError'),
        details: err?.details?.map((detail) => res.__(detail)),
        data: err.data,
      });
    } else {
      return res.status(500).send({
        message: res.__('internalServerError'),
        details: [res.__('internalServerError')],
        data: err.data,
      });
    }
  } else {
    return res.status(500).send({
      message: res.__('internalServerError'),
      details: [res.__('internalServerError')],
      data: err.data,
    });
  }
};
