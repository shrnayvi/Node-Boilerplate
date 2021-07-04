import { inject, injectable } from 'inversify';
import Joi from 'joi';

import { TYPES } from '../types';
import { ILogger } from '../interfaces/ILogger';
import { IErrorService, IErrorArgs } from '../interfaces/services/IErrorService';
import { CustomError, AppError, ValidationError } from '../utils/ApiError';

@injectable()
export default class ErrorService implements IErrorService {
  private logger: ILogger;
  constructor(@inject(TYPES.Logger) logger: ILogger) {
    this.logger = logger;
  }

  getError = (args: IErrorArgs) => {
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

    return err;
  };

  throwError = (args: IErrorArgs) => {
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
