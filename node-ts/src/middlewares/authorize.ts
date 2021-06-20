import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import { ILogger } from '../interfaces/ILogger';
import { IUserAuthRequest } from '../interfaces/IUserAuthRequest';
import { ForbiddenError } from '../utils/ApiError';
import translationKey from '../config/translationKey';

const logger = container.get<ILogger>(TYPES.Logger);
logger.init('server');

/**
 * ACL
 * @param {Array|string} roles User roles to access resource
 */

export default (roles: string | Array<string> = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  /**
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next Next function
   */
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as IUserAuthRequest;
    if (roles.length && roles.includes(_req.user.role)) {
      next();
    } else {
      const error = new ForbiddenError({
        message: translationKey.forbidden,
        details: [translationKey.userNotAuthorized],
      });
      next(error);
    }
  };
};
