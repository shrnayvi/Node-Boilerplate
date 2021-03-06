import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IAuthService } from '../interfaces/services/IAuthService';
import { ILogger } from '../interfaces/ILogger';

import { AppError } from '../utils/ApiError';
import { IUserCreate } from '../interfaces/entities/IUser';

@injectable()
export default class AuthController {
  private authService: IAuthService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.AuthService) authService: IAuthService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.authService = authService;
    this.logger = loggerFactory('AuthController');
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'signUp';

    try {
      // TODO: Validate using Joi?
      let signUpResponse = await this.authService.signUp(req.body);
      return res.status(200).send({ message: 'User registered successfully' });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'login';
    try {
      // TODO: Validate using Joi?
      const loginResponse = await this.authService.login(req.body);
      return res.status(200).send({
        message: 'Login successful',
        data: loginResponse,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'verifyEmail';
    try {
      // TODO: Validate using Joi?
      let response = await this.authService.verifyEmail(req.body);
      return res.status(200).send({
        message: 'Email verified',
        data: response,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'forgotPassword';
    try {
      // TODO: Validate using Joi?
      let response = await this.authService.forgotPassword(req.body);
      return res.status(200).send({
        message: 'Reset link has been sent',
        data: response,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'resetPassword';
    try {
      // TODO: Validate using Joi?
      let response = await this.authService.resetPassword(req.body);
      return res.status(200).send({
        message: 'Password reset successful',
        data: response,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  resendEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'resendEmailVerification';
    try {
      // TODO: Validate using Joi?
      let response = await this.authService.resendVerificationEmail(req.body);
      return res.status(200).send({
        message: 'Verificaion email sent',
        data: response,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  renewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'renewAccessToken';
    try {
      // TODO: Validate using Joi?
      let response = await this.authService.renewAccessToken(req.body?.refreshToken);
      return res.status(200).send({
        message: 'Access token renewed',
        data: response,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'logout';
    try {
      const cookie = req?.cookies || {};
      let refreshToken: string = cookie[config.refreshTokenCookieName];
      if (!refreshToken) {
        refreshToken = req.body?.refreshToken;

        if (!refreshToken) {
          return res.status(400).send({
            message: 'Refresh token not provided',
            data: {},
          });
        }
      }

      const isLoggedOut = await this.authService.logout(refreshToken);
      return res.status(200).send({
        message: 'Logout successful',
        data: isLoggedOut,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };
}
