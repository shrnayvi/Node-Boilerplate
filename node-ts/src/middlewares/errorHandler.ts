import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import { IError } from '../interfaces/IError';

export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.code) {
    if (typeof err.code === 'number') {
      return res.status(err.code).send({
        message: err.message,
        data: err.data,
      });
    } else {
      return res.status(500).send({
        message: 'Internal server error',
        data: err.data,
      });
    }
  } else {
    return res.status(500).send({
      message: 'Internal server error',
      data: err.data,
    });
  }
};
