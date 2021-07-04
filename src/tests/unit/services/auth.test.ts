import container from '../../../inversify.config';
import { TYPES } from '../../../types';

import config from '../../../config';
import { IUserRepository } from '../../../interfaces/repository/IUserRepository';
import { IUserTokenRepository } from '../../../interfaces/repository/IUserTokenRepository';
import { IAuthService } from '../../../interfaces/services/IAuthService';
import { ITokenService } from '../../../interfaces/ITokenService';
import {
  IUserCreate,
  IUserLogin,
  IUserLoginResponse,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResetPasswordInput,
} from '../../../interfaces/entities/IUser';

import UserRepository from '../../../repository/UserRepository';
import BcryptService from '../../../services/BcryptService';
import UserRepositoryMock from '..//mock/UserRepository';
import UserTokenRepositoryMock from '../mock/UserTokenRepository';
import BcryptServiceMock from '../mock/BcryptService';
import { users } from '../mock/data';

import { ValidationError, NotFoundError, ConflictError } from '../../../utils/ApiError';

describe('Auth service', () => {
  container.rebind(TYPES.UserRepository).to(UserRepositoryMock);
  container.rebind(TYPES.HashService).to(BcryptServiceMock);
  container.rebind(TYPES.UserTokenRepository).to(UserTokenRepositoryMock);

  const authService: IAuthService = container.get<IAuthService>(TYPES.AuthService);
  const tokenService: ITokenService = container.get<ITokenService>(TYPES.TokenService);

  describe('Signup Service', () => {
    it('should throw conflict error', async () => {
      let data: IUserCreate = {
        email: 'test@test.com',
        password: 'password',
        firstName: 'First Name',
        lastName: 'Last Name',
      };

      let error;
      try {
        let a = await authService.signUp(data);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(ConflictError);
      expect(error.details).toContain(config.translationKey.userExists);
    });

    it("should return user's _id", async () => {
      let data: IUserCreate = {
        email: 'test@yopmail.com',
        password: 'password',
        firstName: 'First Name',
        lastName: 'Last Name',
      };

      let user = await authService.signUp(data);
      expect(typeof user._id).toBe('string');
    });
  });

  describe('Login Service', () => {
    it('should throw validation error for invalid password', async () => {
      let data: IUserLogin = {
        email: 'test@test.com',
        password: 'invalid',
      };

      let error;
      try {
        await authService.login(data);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(ValidationError);
      expect(error?.details).toContain(config.translationKey.badCredentials);
    });

    it('should throw validation error for non existing user', async () => {
      let data: IUserLogin = {
        email: 'test1@test.com',
        password: 'password',
      };

      let error;
      try {
        await authService.login(data);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(ValidationError);
      expect(error?.details).toContain(config.translationKey.badCredentials);
    });

    it('should login user and return the login response', async () => {
      let data: IUserLogin = {
        email: 'test@test.com',
        password: 'password',
      };

      let response: IUserLoginResponse = await authService.login(data);
      expect(response._id).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.role).toBeDefined();
    });
  });

  describe('Verify Email Service', () => {
    it('should verify email', async () => {
      let email = 'newuser@api.com';
      let token: string = await tokenService.generateToken({
        payload: { email },
        secretKey: config.secretKey,
        expiresAt: config.verificationEmailTokenExpiration,
      });

      let userData: IUserCreate = {
        email,
        password: 'password',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'test',
        role: 'user',
      };

      await authService.signUp(userData);

      let data: IVerifyEmailInput = {
        token,
      };

      let response: boolean = await authService.verifyEmail(data);
      expect(response).toBeTruthy();
    });
  });

  describe('Forgot Password', () => {
    it('should throw user not found error', async () => {
      let data: IForgotPasswordInput = {
        email: 'nouser@api.com',
      };

      let error;
      try {
        await authService.forgotPassword(data);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.details).toContain(config.translationKey.userNotFound);
    });

    it('should send forgot password email', async () => {
      let data: IForgotPasswordInput = {
        email: users[0].email,
      };

      let hasSentEmail = await authService.forgotPassword(data);
      expect(hasSentEmail).toBeTruthy();
    });
  });

  describe('Reset password', () => {
    it('should reset password', async () => {
      let user = users[0];

      let token = await tokenService.generateToken({
        payload: { _id: user._id },
        secretKey: config.secretKey,
        expiresAt: '1hr',
      });

      const newpassword: string = 'newpassword';
      const data: IResetPasswordInput = {
        token,
        password: newpassword,
      };

      await authService.resetPassword(data);

      let response = await authService.login({
        email: user.email,
        password: newpassword,
      });

      expect(response.token).toBeDefined();
    });
  });
});
