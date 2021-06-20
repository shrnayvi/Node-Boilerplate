import { inject, injectable } from 'inversify';
import merge from 'lodash/merge';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';

import { IUserService } from '../interfaces/services/IUserService';
import { IErrorService } from '../interfaces/services/IErrorService';

import { IUser, IUserDocument, IUserUpdate, IUserCreate } from '../interfaces/entities/IUser';
import { IPagingArgs, IPaginationData } from '../interfaces/IPaging';
import { ILogger } from '../interfaces/ILogger';

import { NotFoundError } from '../utils/ApiError';
import Paging from '../utils/Paging';

@injectable()
export default class UserService implements IUserService {
  private name = 'UserService';
  private userRepository: IUserRepository;
  private logger: ILogger;
  private errorService: IErrorService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this.userRepository = userRepository;
    this.logger = loggerFactory(this.name);
    this.errorService = errorService;
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
        data: rows,
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

  getById = (id: string) => this.userRepository.getById(id);

  create = async (args: IUserCreate) => {
    const operation = 'create';
    const email = args.email;
    const username = args.username;
    const firstName = args.firstName;
    const lastName = args.lastName;
    const password = args.password;

    try {
      let user = await this.userRepository.create({
        email,
        username,
        firstName,
        lastName,
        password,
      });

      return user;
    } catch (err) {
      this.errorService.handleError({
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
      this.errorService.handleError({
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
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };
}
