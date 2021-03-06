import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IUserLoginServiceResponse } from '../interfaces/entities/IUser';
import { ILogger } from '../interfaces/ILogger';

import { AppError } from '../utils/ApiError';

@injectable()
export default class TokenController {
  private authService: IAuthService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.AuthService) authService: IAuthService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.authService = authService;
    this.logger = loggerFactory('TokenController');
  }

  renewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const cookie: any = req.cookies || {};
    const refreshToken: string = cookie[config.refreshTokenCookieName];
    let newAccessToken: string = '';
    if (refreshToken) {
      try {
        const tokenResult: IUserLoginServiceResponse = await this.authService.renewAccessToken(refreshToken);
        return res.status(200).send({
          message: 'Token refresh successful',
          data: {
            accessToken: tokenResult.token,
            _id: tokenResult._id,
            role: tokenResult.role,
          },
        });
      } catch (err) {
        this.logger.info({ message: 'Error renewing access token', operation: 'renewAccessToken', data: err });
        next(err);
      }
    } else {
      this.logger.info({ message: 'Refresh token not provided', operation: 'renewAccessToken' });
      return res.status(400).send({ message: 'Invalid Token' });
    }
  };
}
