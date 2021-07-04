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

// Logger
import { ILogger } from './interfaces/ILogger';
import WinstonLogger from './utils/WinstonLogger';

// Graphql
import { IGraphql } from './interfaces/IGraphql';
import GraphqlService from './services/GraphqlService';

// JWT
import { ITokenService } from './interfaces/ITokenService';
import JWTService from './services/JWTService';

// Hash
import { IHashService } from './interfaces/services/IHashService';
import BcryptService from './services/BcryptService';

// Auth
import { IAuthService } from './interfaces/services/IAuthService';
import AuthService from './services/AuthService';
import AuthController from './controllers/AuthController';

// Email
import { IEmailService } from './interfaces/services/IEmailService';
import EmailService from './services/EmailService';

// Error
import { IErrorService } from './interfaces/services/IErrorService';
import ErrorService from './services/ErrorService';

// Joi
import { IJoiService } from './interfaces/services/IJoiService';
import JoiService from './services/JoiService';

// MockExample:
import UserRepositoryMock from './tests/unit/mock/UserRepository';

const container = new Container();

// User
//MockExample: container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryMock);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);

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

// Graphql
container.bind<IGraphql>(TYPES.GraphqlService).to(GraphqlService);

// JWT
container.bind<ITokenService>(TYPES.TokenService).to(JWTService);

// HashService
container.bind<IHashService>(TYPES.HashService).to(BcryptService);

// EmailService
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

// UserTokenRepository
container.bind<IUserTokenRepository>(TYPES.UserTokenRepository).to(UserTokenRepository);
container.bind<IUserTokenService>(TYPES.UserTokenService).to(UserTokenService);
container.bind<UserTokenController>(TYPES.UserTokenController).to(UserTokenController);
container.bind<UserController>(TYPES.UserController).to(UserController);

// Error
container.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);

// Joi
container.bind<IJoiService>(TYPES.JoiService).to(JoiService);

export default container;
