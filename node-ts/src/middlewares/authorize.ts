import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import { ILogger } from '../interfaces/ILogger';
import { IUserAuthRequest } from '../interfaces/IUserAuthRequest';
import { ForbiddenError } from '../utils/ApiError';

const logger = container.get<ILogger>(TYPES.Logger);
logger.init('server');

/**
 * ACL
 * @param {Array|string} roles User roles to access resource
 */

export default (...roles: string[]) => {
  /**
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next Next function
   */
  return (eReq: Request, res: Response, next: NextFunction) => {
    const req = eReq as IUserAuthRequest;
    if (roles.length && roles.includes(req.user.role)) {
      next();
    } else {
      const error = new ForbiddenError({
        message: 'Forbidden',
        data: {
          user: req?.user?._id,
        },
      });
      next(error);
    }
  };
};
