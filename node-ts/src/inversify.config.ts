import 'reflect-metadata';
import { Container, interfaces } from 'inversify';

import { TYPES } from './types';

import { IUserRepository } from './interfaces/repository/IUserRepository';
import { IUserService } from './interfaces/services/IUserService';

import { IUserTokenRepository } from './interfaces/repository/IUserTokenRepository';
import { IUserTokenService } from './interfaces/services/IUserTokenService';

import { IAppService } from './interfaces/services/IAppService';

// User
import UserRepository from './repository/UserRepository';
import UserService from './services/UserService';
import UserController from './controllers/UserController';

// UserToken
import UserTokenService from './services/UserTokenService';
import UserTokenRepository from './repository/UserTokenRepository';
import UserTokenController from './controllers/TokenController';

// App
import AppService from './services/AppService';
import AppController from './controllers/AppController';

// Auth
import AuthController from './controllers/AuthController';

// Logger
import { ILogger } from './interfaces/ILogger';
import WinstonLogger from './utils/WinstonLogger';

// JWT
import { ITokenService } from './interfaces/ITokenService';
import JWTService from './services/JWTService';

// Validation
import { IAuthValidation } from './interfaces/validation/IAuthValidation';
import AuthValidation from './validation/AuthValidation';

// Hash
import { IHashService } from './interfaces/services/IHashService';
import BcryptService from './services/BcryptService';

// Auth
import { IAuthService } from './interfaces/services/IAuthService';
import AuthService from './services/AuthService';

// Email
import { IEmailService } from './interfaces/services/IEmailService';
import EmailService from './services/EmailService';

const container = new Container();

// User
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);

// App
container.bind<IAppService>(TYPES.AppService).to(AppService);
container.bind<AppController>(TYPES.AppController).to(AppController);

// Auth
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// Logger
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);
container.bind<interfaces.Factory<ILogger>>(TYPES.LoggerFactory).toFactory<ILogger>((context: interfaces.Context) => {
  return (name: string) => {
    let logger = context.container.get<ILogger>(TYPES.Logger);
    logger.init(name);
    return logger;
  };
});

// JWT
container.bind<ITokenService>(TYPES.TokenService).to(JWTService);

// Validation
container.bind<IAuthValidation>(TYPES.AuthValidation).to(AuthValidation);

// HashService
container.bind<IHashService>(TYPES.HashService).to(BcryptService);

// EmailService
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

// UserTokenRepository
container.bind<IUserTokenRepository>(TYPES.UserTokenRepository).to(UserTokenRepository);
container.bind<IUserTokenService>(TYPES.UserTokenService).to(UserTokenService);
container.bind<UserTokenController>(TYPES.UserTokenController).to(UserTokenController);

export default container;
