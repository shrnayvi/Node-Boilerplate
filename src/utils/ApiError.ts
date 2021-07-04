import { IError, ITranslatedError } from '../interfaces/IError';
import translationKey from '../config/translationKey';

export class CustomError extends Error {
  readonly message: string;
  readonly code: number;
  readonly error: any;
  readonly data: any;
  readonly translationKey: string;
  readonly details: Array<string>;

  constructor({ message, code, details, error, data }: IError) {
    super(message);
    this.code = code || 500;
    this.details = details;
    this.error = error || null;
    this.data = data || null;
    this.message = message || translationKey.internalServerError;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for translation message
 */
export class TranslatedError extends Error {
  readonly message: string;
  readonly code: number;
  readonly error: any;
  readonly data: any;
  readonly details: Array<string>;

  /**
   * Create a new validation error. Internal Code: 4000
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {String=} args.message - The error message
   * @param {[String]=} args.details - Error details
   */
  constructor({ message, code, details, data, error }: ITranslatedError) {
    super(message);
    this.message = message || translationKey.internalServerError;
    this.code = code || 500;
    this.error = error || null;
    this.data = data || null;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppError extends CustomError {
  /**
   * Create a new validation error. Internal Code: 4000
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {String=} args.message - The error message
   * @param {[String]=} args.details - Error details
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.internalServerError,
      code: 500,
      error: args.error,
      data: args.data,
      details: args.details || [],
    });
  }
}

export class ValidationError extends CustomError {
  /**
   * Create a new validation error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.validationError,
      code: 400,
      error: args.error,
      data: args.data,
      details: args.details || [],
    });
  }
}

export class NotFoundError extends CustomError {
  /**
   * Create a new not found error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.resourceNotFound,
      code: 404,
      error: args.error,
      data: args.data,
      details: args.details || [],
    });
  }
}

export class ForbiddenError extends CustomError {
  /**
   * Create a new forbidden error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.userNotAuthorized,
      code: 403,
      error: args.error,
      data: args.data,
      details: args.details || [translationKey.userNotAuthorized],
    });
  }
}

export class NotAuthenticatedError extends CustomError {
  /**
   * Create a new forbidden error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.userNotAuthenticated,
      code: 401,
      error: args.error,
      data: args.data,
      details: args.details || [translationKey.userNotAuthenticated],
    });
  }
}

export class NotImplementedError extends CustomError {
  /**
   * Create a new not implemented error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.notImplemented,
      code: 501,
      error: args.error,
      data: args.data,
      details: args.details || [translationKey.notImplemented],
    });
  }
}

export class ConflictError extends CustomError {
  /**
   * Create a new confict error.
   * @param {Object} args - The args object
   * @param {any} args.error - The error
   * @param {any} args.data - The data
   * @param {string[]} args.details - Error details
   * @param {number} args.code - The error code
   * @param {string=} args.message - The error message
   */
  constructor(args: IError) {
    super({
      message: args.message || translationKey.resourceConflict,
      code: 409,
      error: args.error,
      data: args.data,
      details: args.details || [translationKey.resourceConflict],
    });
  }
}
