import { inject, injectable } from 'inversify';
import merge from 'lodash/merge';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';

import { IUserService } from '../interfaces/services/IUserService';

import { IUser, IUserDocument, IUserUpdate, IUserCreate } from '../interfaces/entities/IUser';
import { IPagingArgs, IPaginationData } from '../interfaces/IPaging';
import { ILogger } from '../interfaces/ILogger';

import { NotFoundError } from '../utils/ApiError';
import Paging from '../utils/Paging';

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.userRepository = userRepository;
    this.logger = loggerFactory('UserService');
  }

  getAll = (args?: any): Promise<IPaginationData<IUserDocument[]>> => {
    const operation = 'getAll';
    const pagingArgs: IPagingArgs = Paging.getPagingArgs(args || {});

    this.logger.info({ operation, message: 'Get all users', data: args });
    return this.userRepository.get(pagingArgs);
  };

  getById = (id: string) => this.userRepository.getById(id);

  create = (user: IUserCreate) => this.userRepository.create(user);

  update = async (_id: string, user: IUserUpdate) => {
    const foundUser: IUserDocument | null = await this.userRepository.getSingleUser({ _id });
    if (!foundUser) {
      throw new NotFoundError({
        message: 'User not found',
        data: { _id },
      });
    }

    let update = <IUserUpdate>merge(foundUser, user);

    return this.userRepository.update(_id, update);
  };

  delete = (id: string) => this.userRepository.delete(id);
}
