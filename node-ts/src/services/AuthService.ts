import { inject, injectable } from 'inversify';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { ITokenService } from '../interfaces/ITokenService';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IHashService } from '../interfaces/services/IHashService';
import { IEmailService } from '../interfaces/services/IEmailService';
import { IErrorService } from '../interfaces/services/IErrorService';
import {
  IUserLogin,
  IUserCreate,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IResendVerificationEmail,
  IUserLoginResponse,
  IUserDocument,
  ITokenPayload,
} from '../interfaces/entities/IUser';
import { IUserTokenDocument } from '../interfaces/entities/IUserToken';
import { IUserTokenService } from '../interfaces/services/IUserTokenService';
import { ILogger } from '../interfaces/ILogger';
import { userEmitter } from '../subscribers';

import { ValidationError, NotFoundError, ConflictError } from '../utils/ApiError';

@injectable()
export default class AuthService implements IAuthService {
  private name = 'AuthService';
  private userRepository: IUserRepository;
  private logger: ILogger;
  private tokenService: ITokenService;
  private hashService: IHashService;
  private emailService: IEmailService;
  private userTokenService: IUserTokenService;
  private errorService: IErrorService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.TokenService) tokenService: ITokenService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger,
    @inject(TYPES.HashService) hashService: IHashService,
    @inject(TYPES.EmailService) emailService: IEmailService,
    @inject(TYPES.UserTokenService) userTokenService: IUserTokenService,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.logger = loggerFactory('AuthService');
    this.hashService = hashService;
    this.emailService = emailService;
    this.userTokenService = userTokenService;
    this.errorService = errorService;
  }

  signUp = async (args: IUserCreate) => {
    const operation = 'signUp';
    const role: string = config.roles.user;
    const email = args.email;
    const username = args.username;
    const password = args.password;
    const firstName = args.firstName;
    const lastName = args.lastName;

    try {
      let foundUser: IUserDocument | null = await this.userRepository.getUser({ email });

      if (foundUser) {
        throw new ConflictError({
          message: config.translationKey.userExists,
          details: [config.translationKey.userExists],
          data: { email: args.email },
        });
      }

      let hashedPassword: string = await this.hashService.hash(password, 12);

      let user = await this.userRepository.create({
        email,
        firstName,
        lastName,
        username,
        role,
        password: hashedPassword,
      });

      // Emit event for signup
      userEmitter.emit(config.events.onSignUp, user);

      return {
        _id: user._id,
      };
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  login = async (args: IUserLogin): Promise<IUserLoginResponse> => {
    const operation = 'login';
    try {
      const email = args.email;
      const password = args.password;

      const user = await this.userRepository.getUser({ email });

      if (!user) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.badCredentials],
          data: { email },
        });
      }

      const isPasswordCorrect = await this.hashService.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.badCredentials],
          data: { email },
        });
      }

      const payload: ITokenPayload = {
        _id: user._id,
        role: user.role,
      };

      const token = await this.tokenService.generateToken({
        payload,
        expiresAt: config.authTokenExpiration,
        secretKey: config.secretKey,
      });

      const refreshToken = await this.userTokenService.create({
        payload,
        expiresIn: config.refreshTokenExpiration,
        secretKey: config.refreshTokenKey,
        user: user._id,
        tokenType: config.tokenType.refresh,
      });

      return {
        _id: user._id,
        token,
        role: user.role,
        refreshToken: refreshToken.token,
      };
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  verifyEmail = async (args: IVerifyEmailInput): Promise<boolean> => {
    const operation = 'verifyEmail';

    try {
      const token = args.token;

      let decoded = await this.tokenService.verifyToken({ token, secretKey: config.secretKey });
      let { email } = decoded;

      if (!email) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.tokenInvalid],
          data: args,
        });
      }

      let user = await this.userRepository.getUser({ email });
      if (!user) {
        throw new NotFoundError({
          message: config.translationKey.userNotFound,
          details: [config.translationKey.userNotFound],
          data: {
            email,
          },
        });
      }

      let updatedUser = await this.userRepository.update({
        _id: user._id,
        isEmailVerified: true,
      });

      return true;
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  forgotPassword = async (args: IForgotPasswordInput): Promise<boolean> => {
    const operation = 'forgotPassword';

    try {
      const email = args.email;

      const user: IUserDocument | null = await this.userRepository.getUser({ email });
      if (!user) {
        throw new NotFoundError({
          message: config.translationKey.userNotFound,
          details: [config.translationKey.userNotFound],
          data: args,
        });
      }

      const token: string = await this.tokenService.generateToken({
        payload: { _id: user._id },
        expiresAt: config.forgotPasswordTokenExpiration,
        secretKey: config.secretKey,
      });

      // send email
      this.emailService
        .sendMail({
          email: user.email,
          token,
        })
        .catch((err) => {
          this.logger.error({ operation, message: 'Error sending email', data: args });
        });

      return true;
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  resetPassword = async (args: IResetPasswordInput): Promise<boolean> => {
    const operation = 'resetPassword';
    try {
      const token = args.token;
      const password = args.password;

      let decoded: any = await this.tokenService.verifyToken({
        token,
        secretKey: config.secretKey,
      });

      if (decoded._id) {
        let user: IUserDocument | null = await this.userRepository.getById(decoded._id);
        if (!user) {
          throw new NotFoundError({
            message: config.translationKey.userNotFound,
            details: [config.translationKey.userNotFound],
            data: { _id: decoded._id },
          });
        }

        const hashedPassword: string = await this.hashService.hash(password);

        return this.userRepository.changePassword(decoded._id, hashedPassword);
      }

      return false;
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  resendVerificationEmail = async (args: IResendVerificationEmail): Promise<boolean> => {
    const operation = 'resendVerificationEmail';

    try {
      const email = args.email;

      const user: IUserDocument | null = await this.userRepository.getUser({ email });
      if (!user) {
        throw new NotFoundError({
          message: config.translationKey.userNotFound,
          details: [config.translationKey.userNotFound],
          data: args,
        });
      }

      this.emailService
        .sendMail({
          email,
        })
        .then((_) =>
          this.logger.info({
            message: 'Resend verification email sent',
            operation: 'resendVerificationEmail',
            data: args,
          })
        );

      return true;
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  renewAccessToken = async (refreshToken: string): Promise<IUserLoginResponse> => {
    const operation = 'renewAccessToken';

    try {
      const tokenDoc: IUserTokenDocument | null = await this.userTokenService.getByToken(refreshToken);
      if (!tokenDoc) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.tokenInvalid],
          data: { refreshToken },
        });
      }

      const token = tokenDoc.token;

      const decoded: any = await this.tokenService
        .verifyToken({
          token,
          secretKey: config.refreshTokenKey,
        })
        .catch((err) =>
          this.logger.error({ operation: 'renewAccessToken', message: 'Invalid refresh token', data: { refreshToken } })
        );

      if (!decoded) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.tokenInvalid],
          data: { refreshToken },
        });
      }

      const payload = {
        _id: decoded?._id,
        role: decoded?.role,
      };

      const newAccessToken = await this.tokenService.generateToken({
        payload: payload,
        expiresAt: config.authTokenExpiration,
        secretKey: config.secretKey,
      });

      return {
        token: newAccessToken,
        refreshToken,
        ...payload,
      };
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  logout = async (refreshToken: string): Promise<boolean> => {
    const operation = 'logout';

    return this.userTokenService
      .deleteByToken({
        token: refreshToken,
      })
      .then((data) => (data ? true : false))
      .catch((err) => {
        this.errorService.handleError({
          err,
          operation,
          name: this.name,
          logError: true,
        });
      });
  };
}
