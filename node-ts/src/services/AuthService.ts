import { inject, injectable } from 'inversify';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { ITokenService } from '../interfaces/ITokenService';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IAuthValidation } from '../interfaces/validation/IAuthValidation';
import { IHashService } from '../interfaces/services/IHashService';
import { IEmailService } from '../interfaces/services/IEmailService';
import {
  IUserLogin,
  IUserCreate,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IResendVerificationEmail,
  IUserLoginServiceResponse,
  IUserDocument,
  ITokenPayload,
} from '../interfaces/entities/IUser';
import { IUserTokenDocument } from '../interfaces/entities/IUserToken';
import { IUserTokenService } from '../interfaces/services/IUserTokenService';
import { ILogger } from '../interfaces/ILogger';
import { userEmitter } from '../subscribers';

import { ValidationError, NotFoundError, ConfictError } from '../utils/ApiError';

@injectable()
export default class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private logger: ILogger;
  private tokenService: ITokenService;
  private authValidation: IAuthValidation;
  private hashService: IHashService;
  private emailService: IEmailService;
  private userTokenService: IUserTokenService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.TokenService) tokenService: ITokenService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger,
    @inject(TYPES.AuthValidation) authValidation: IAuthValidation,
    @inject(TYPES.HashService) hashService: IHashService,
    @inject(TYPES.EmailService) emailService: IEmailService,
    @inject(TYPES.UserTokenService) userTokenService: IUserTokenService
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.authValidation = authValidation;
    this.logger = loggerFactory('AuthService');
    this.hashService = hashService;
    this.emailService = emailService;
    this.userTokenService = userTokenService;
  }

  signUp = async (data: IUserCreate) => {
    // Validate Signup data
    this.authValidation.validateSignUp(data);

    let role: string = config.roles.user;

    try {
      let foundUser: IUserDocument | null = await this.userRepository.getSingleUser({ email: data.email });
      if (foundUser) {
        throw new ConfictError({
          message: 'User already exists',
          data: { email: data.email },
        });
      }

      let { password, ...args } = data;
      let hashedPassword: string = await this.hashService.hash(password, 12);

      let user = await this.userRepository.create({
        ...args,
        role,
        password: hashedPassword,
      });

      // Emit event for signup
      userEmitter.emit(config.events.onSignUp, user);

      return {
        _id: user._id,
      };
    } catch (err) {
      throw err;
    }
  };

  login = async (data: IUserLogin): Promise<IUserLoginServiceResponse> => {
    this.authValidation.validateLogin(data);

    try {
      const user = await this.userRepository.getSingleUser({ email: data.email });
      if (!user) {
        throw new ValidationError({
          message: 'Bad credentials',
          data: { email: data.email },
        });
      }

      const isPasswordCorrect = await this.hashService.compare(data.password, user.password);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: 'Bad credentials',
          data: { email: data.email },
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
      this.logger.error({
        operation: 'akd',
        message: 'Error',
        data: err,
      });
      throw err;
    }
  };

  verifyEmail = async (data: IVerifyEmailInput): Promise<boolean> => {
    this.authValidation.validateEmailVerification(data);

    try {
      let decoded = await this.tokenService.verifyToken({ token: data.token, secretKey: config.secretKey });
      let { email } = decoded;
      if (!email) {
        throw new ValidationError({
          message: 'Token invalid',
          data,
        });
      }

      let user = await this.userRepository.getSingleUser({ email });
      if (!user) {
        throw new NotFoundError({
          message: 'User not found',
          data: {
            email,
          },
        });
      }

      let updatedUser = await this.userRepository.update(user._id, {
        isEmailVerified: true,
      });

      return true;
    } catch (err) {
      throw err;
    }
  };

  forgotPassword = async (data: IForgotPasswordInput): Promise<boolean> => {
    const operation = 'forgotPassword';

    this.authValidation.validateForgotPassword(data);

    try {
      const user: IUserDocument | null = await this.userRepository.getSingleUser({ email: data.email });
      if (!user) {
        throw new NotFoundError({
          message: 'User not found',
          data,
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
          this.logger.error({ operation, message: 'Error sending email', data: err });
        });

      return true;
    } catch (err) {
      throw err;
    }
  };

  resetPassword = async (data: IResetPasswordInput): Promise<boolean> => {
    this.authValidation.validateResetPasswordValidation(data);

    try {
      let decoded: any = await this.tokenService.verifyToken({
        token: data.token,
        secretKey: config.secretKey,
      });

      if (decoded._id) {
        let user: IUserDocument | null = await this.userRepository.getById(decoded._id);
        if (!user) {
          throw new NotFoundError({
            message: 'User not found',
            data: { _id: decoded._id },
          });
        }

        const hashedPassword: string = await this.hashService.hash(data.password);

        return this.userRepository.changePassword(decoded._id, hashedPassword);
      }

      return false;
    } catch (err) {
      throw err;
    }
  };

  resendVerificationEmail = async (data: IResendVerificationEmail): Promise<boolean> => {
    // vaidation
    this.authValidation.validateResendVerification(data);

    try {
      const user: IUserDocument | null = await this.userRepository.getSingleUser({ email: data.email });
      if (!user) {
        throw new NotFoundError({
          message: 'User not found',
          data,
        });
      }

      // TODO: Generate token and send email
      //this.emailService
      //.sendMail(data)
      //.then((_) =>
      //this.logger.info({ message: 'Resend verification email sent', operation: 'resendVerificationEmail', data })
      //);

      return true;
    } catch (err) {
      throw err;
    }
  };

  renewAccessToken = async (refreshToken: string): Promise<IUserLoginServiceResponse> => {
    try {
      const tokenDoc: IUserTokenDocument | null = await this.userTokenService.getByToken(refreshToken);
      if (!tokenDoc) {
        throw new ValidationError({
          message: 'Invalid Token',
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
          message: 'Invalid Token',
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
        ...payload,
      };
    } catch (err) {
      throw err;
    }
  };

  logout = async (refreshToken: string): Promise<boolean> => {
    return this.userTokenService
      .deleteByToken({
        token: refreshToken,
      })
      .then((data) => (data ? true : false));
  };
}
