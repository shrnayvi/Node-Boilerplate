import ms from 'ms';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { CookieOptions } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IUserSignupResponse } from '../interfaces/entities/IUser';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IJoiService } from '../interfaces/services/IJoiService';
import AuthService from '../services/AuthService';
import AuthValidation from '../validation/AuthValidation';

const translationKey = config.translationKey;

@injectable()
export default class AuthController {
  private name = 'AuthController';
  private authService: IAuthService;
  private joiService: IJoiService;

  constructor(@inject(TYPES.AuthService) authService: IAuthService, @inject(TYPES.JoiService) joiService: IJoiService) {
    this.authService = authService;
    this.joiService = joiService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'register';

    try {
      const args = req.body;

      const email = args.email;
      const password = args.password;
      const firstName = args.firstName;
      const lastName = args.lastName;

      const schema = AuthValidation.signUp();

      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      let signUpResponse = await this.authService.signUp({
        email,
        password,
        firstName,
        lastName,
      });

      return res.status(200).send({
        message: res.__(translationKey.registerSuccess),
        data: signUpResponse,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'login';

    try {
      const args = req.body;
      const email = args.email;
      const password = args.password;

      const schema = AuthValidation.login();

      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
        },
      });

      const loginResponse = await this.authService.login({
        email,
        password,
      });

      const options: CookieOptions = {
        maxAge: ms(config.refreshTokenExpiration),
        httpOnly: true,
      };

      res.cookie(config.refreshTokenCookieName, loginResponse.refreshToken, options);

      return res.status(200).send({
        message: res.__(translationKey.loginSuccess),
        data: loginResponse,
      });
    } catch (err) {
      next(err);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'verifyEmail';

    try {
      const args = req.body;
      const token = args?.token;

      const schema = AuthValidation.emailVerification();

      await this.joiService.validate({
        schema,
        input: {
          token,
        },
      });

      let response = await this.authService.verifyEmail({
        token,
      });

      return res.status(200).send({
        message: res.__(translationKey.verifyEmailSuccess),
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'forgotPassword';

    try {
      const _id = req.params._id;
      const args = req.body;
      const email = args?.email;

      const schema = AuthValidation.forgotPassword();
      await this.joiService.validate({
        schema,
        input: {
          email,
        },
      });

      let response = await this.authService.forgotPassword({
        email,
      });

      return res.status(200).send({
        message: res.__(translationKey.forgotPasswordSuccess),
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'resetPassword';

    try {
      const _id = req.params._id;
      const args = req.body;
      const token = args?.token;
      const password = args?.password;

      const schema = AuthValidation.resetPassword();
      await this.joiService.validate({
        schema,
        input: {
          token,
          password,
        },
      });

      let response = await this.authService.resetPassword({
        token,
        password,
      });

      return res.status(200).send({
        message: res.__(translationKey.resetPasswordSuccess),
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };

  resendEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'resendEmailVerification';

    try {
      const _id = req.params._id;
      const args = req.body;
      const email = args?.email;

      const schema = AuthValidation.resendVerificationEmail();
      await this.joiService.validate({
        schema,
        input: {
          email,
        },
      });

      let response = await this.authService.resendVerificationEmail({
        email,
      });

      return res.status(200).send({
        message: res.__(translationKey.resendEmailVerificationSuccess),
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'logout';

    try {
      const cookie = req?.cookies || {};

      const refreshToken = cookie[config.refreshTokenCookieName];
      if (refreshToken) {
        return this.authService.logout(refreshToken);
      }
      return res.status(200).send({
        message: res.__(translationKey.logoutSuccess),
      });
    } catch (err) {
      next(err);
    }
  };
}
