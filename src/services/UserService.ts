import { inject, injectable } from 'inversify';
import merge from 'lodash/merge';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';

import { IUserService } from '../interfaces/services/IUserService';
import { IErrorService } from '../interfaces/services/IErrorService';

import { IUser, IUserDocument, IUserUpdate, IUserCreate, IChangePassword } from '../interfaces/entities/IUser';
import { IPagingArgs, IPaginationData } from '../interfaces/IPaging';
import { ILogger } from '../interfaces/ILogger';
import { IHashService } from '../interfaces/services/IHashService';

import { NotFoundError, ValidationError } from '../utils/ApiError';
import Paging from '../utils/Paging';

@injectable()
export default class UserService implements IUserService {
  private name = 'UserService';
  private userRepository: IUserRepository;
  private logger: ILogger;
  private errorService: IErrorService;
  private hashService: IHashService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger,
    @inject(TYPES.ErrorService) errorService: IErrorService,
    @inject(TYPES.HashService) hashService: IHashService
  ) {
    this.userRepository = userRepository;
    this.logger = loggerFactory(this.name);
    this.errorService = errorService;
    this.hashService = hashService;
  }

  getAll = async (args?: any): Promise<IPaginationData<IUserDocument[]>> => {
    const operation = 'getAll';
    const pagingArgs: IPagingArgs = Paging.getPagingArgs(args);

    try {
      let { rows, count } = await this.userRepository.getAllAndCount(pagingArgs);

      const paging = Paging.getPagingResult(pagingArgs, { total: count });

      this.logger.info({ operation, message: 'Get all users', data: args });

      return {
        paging,
        results: rows,
      };
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  getById = async (id: string) => {
    const operation = 'getById';
    try {
      let user = await this.userRepository.getById(id);
      return user;
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  create = async (args: IUserCreate) => {
    const operation = 'create';
    const email = args.email;
    const username = args.username;
    const firstName = args.firstName;
    const lastName = args.lastName;
    const password = args.password;
    const role = args.role;

    try {
      let user = await this.userRepository.create({
        email,
        username,
        firstName,
        lastName,
        password,
        role,
      });

      return user;
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  update = async (args: { _id: string } & IUserUpdate) => {
    const operation = 'update';
    const _id = args?._id;
    const firstName = args?.firstName;
    const lastName = args?.lastName;
    const isEmailVerified = args?.isEmailVerified;

    try {
      let updated = await this.userRepository.update({
        _id,
        firstName,
        lastName,
        isEmailVerified,
      });

      return updated;
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  delete = async (id: string) => {
    const operation = 'delete';
    try {
      let deletedUser = await this.userRepository.delete(id);
      return deletedUser;
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  changePassword = async (args: { _id: string } & IChangePassword): Promise<boolean> => {
    const operation = 'changePassword';
    const _id = args?._id;
    const oldPassword = args?.oldPassword;
    const password = args?.password;

    try {
      const user = await this.userRepository.getUser({ _id });

      if (!user) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.badCredentials],
          data: { _id },
        });
      }

      const isPasswordCorrect = await this.hashService.compare(oldPassword, user.password);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.passwordNotMatch],
          data: { _id },
        });
      }

      await this.userRepository.update({
        _id,
        password,
      });

      return true;
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };
}
