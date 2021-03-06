import { IError, ITranslationError } from '../interfaces/IError';

class CustomError extends Error {
  readonly message: string;
  readonly code: number;
  readonly data: any;

  constructor({ message, code, data }: IError) {
    super(message);
    this.message = message || 'Internal server error';
    this.code = code || 500;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for translation message
 */
export class TranslationError extends Error {
  readonly message: string;
  readonly code: number;
  readonly data: any;

  /**
   * Create a new validation error. Internal Code: 4000
   * @param {Object} args - The args object
   * @param {String=} args.message - The error message
   * @param {[String]=} args.details - Error details
   */
  constructor({ message, code, data }: ITranslationError) {
    super(message);
    this.message = message || 'Internal server error';
    this.code = code || 500;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppError extends CustomError {
  /**
   * Create a new validation error. Internal Code: 4000
   * @param {Object} args - The args object
   * @param {String=} args.message - The error message
   * @param {[String]=} args.details - Error details
   */
  constructor(args: IError) {
    super({
      message: args.message || 'Internal server error',
      code: 500,
      data: args.data || {},
    });
  }
}

export class ValidationError extends CustomError {
  /**
   * Create a new validation error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'Internal server error',
      code: 400,
      data: args.data || {},
    });
  }
}

export class NotFoundError extends CustomError {
  /**
   * Create a new not found error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'Resource not found',
      code: 404,
      data: args.data || {},
    });
  }
}

export class ForbiddenError extends CustomError {
  /**
   * Create a new forbidden error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'User not authorized to perform this action',
      code: 403,
      data: args.data || {},
    });
  }
}

export class NotAuthenticatedError extends CustomError {
  /**
   * Create a new forbidden error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'User not authenticated',
      code: 401,
      data: args.data || {},
    });
  }
}

export class NotImplementedError extends CustomError {
  /**
   * Create a new not implemented error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'Not implemented',
      code: 501,
      data: args.data || {},
    });
  }
}

export class ConfictError extends CustomError {
  /**
   * Create a new confict error.
   * @param {Object} args - The args object
   * @param {string=} args.message - The error message
   * @param {number} args.code - The error code
   * @param {any=} args.data - Error data
   */
  constructor(args: IError) {
    super({
      message: args.message || 'Resource conflicted',
      code: 409,
      data: args.data || {},
    });
  }
}
