import { inject, injectable } from 'inversify';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { TYPES } from '../types';
import { ILogger } from '../interfaces/ILogger';
import { IErrorService, IErrorServiceArgs } from '../interfaces/services/IErrorService';
import { CustomError, AppError, ValidationError } from '../utils/ApiError';

@injectable()
export default class ErrorService implements IErrorService {
  private logger: ILogger;
  constructor(@inject(TYPES.Logger) logger: ILogger) {
    this.logger = logger;
  }

  handleError = (args: IErrorServiceArgs) => {
    let err = args.err;

    if (err instanceof Joi.ValidationError) {
      err = new ValidationError({
        details: err.details.map((x) => x.message),
      });
    } else if (!(err instanceof CustomError)) {
      // Error is unknown error
      err = new AppError({
        details: [err?.message],
      });
    }

    if (args.logError) {
      this.logger.init(args.name ?? 'ErrorService');
      this.logger.error({
        message: err.message,
        operation: args.operation,
        data: err,
      });
    }

    throw err;
  };
}
