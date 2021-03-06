import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../types';
import config from '../config';
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
export default async (eReq: Request, res: Response, next: NextFunction) => {
  try {
    const req = eReq as IUserAuthRequest;
    let token = await TokenService.extractToken(req.headers);
    try {
      let decoded = await TokenService.verifyToken({
        token,
        secretKey: config.secretKey,
      });
      req.user = decoded as IUserAuthData;
      next();
    } catch (err) {
      throw new NotAuthenticatedError({
        message: 'User not authenticated',
        data: err,
      });
    }
  } catch (err) {
    next(err);
  }
};
