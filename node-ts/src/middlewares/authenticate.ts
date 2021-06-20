import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../types';
import config from '../config';
import translationKey from '../config/translationKey';
import container from '../inversify.config';
import { ITokenService } from '../interfaces/ITokenService';
import { IUserAuthData, IUserAuthRequest } from '../interfaces/IUserAuthRequest';
import { NotAuthenticatedError } from '../utils/ApiError';

const TokenService: ITokenService = container.get<ITokenService>(TYPES.TokenService);

/**
 * Checks token and handles authentication
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next Next function
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as IUserAuthRequest;
    let token = await TokenService.extractToken(req.headers);
    try {
      let decoded = await TokenService.verifyToken({
        token,
        secretKey: config.secretKey,
      });
      _req.user = decoded as IUserAuthData;
      next();
    } catch (err) {
      throw new NotAuthenticatedError({
        message: translationKey.userNotAuthenticated,
        details: [translationKey.userNotAuthenticated],
      });
    }
  } catch (err) {
    next(err);
  }
};
