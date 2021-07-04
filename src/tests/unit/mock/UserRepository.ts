import { injectable } from 'inversify';
import find from 'lodash/find';

import { IUserRepository } from '../../../interfaces/repository/IUserRepository';

import config from '../../../config';
import { IUser, IUserDocument, IUserCreate, IUserUpdate } from '../../../interfaces/entities/IUser';
import { IPaginationData, IPagingArgs, IGetAllAndCountResult } from '../../../interfaces/IPaging';
import { IUserM, users, existingUserEmail } from './data';
import Paging from '../../../utils/Paging';
import { ConflictError } from '../../../utils/ApiError';

@injectable()
export default class UserRepositoryMock implements IUserRepository {
  getAllAndCount(pagingArgs: IPagingArgs): Promise<IGetAllAndCountResult<IUserDocument[]>> {
    return Promise.resolve({ count: users.length, rows: users as IUserDocument[] });
  }

  getUsers(query: any) {
    return Promise.resolve(users as IUserDocument[]);
  }

  getById = async (id: string): Promise<IUserDocument | null> => {
    let user = users.find((u) => u._id === id);
    if (user) {
      return Promise.resolve(user as IUserDocument);
    }
    return Promise.resolve(null);
  };

  getUser = async (query: any): Promise<IUserDocument | null> => {
    let user = find(users, query) as IUserDocument;
    return user;
  };

  create(args: IUserCreate): Promise<IUserDocument> {
    if (args.email === existingUserEmail) {
      throw new ConflictError({
        message: config.translationKey.userExists,
        details: [config.translationKey.userExists],
      });
    }
    let newUser = {
      ...args,
      _id: 'newuserid',
      isEmailVerified: false,
    };

    users.push(newUser as IUserM);
    return Promise.resolve(newUser as IUserDocument);
  }

  update(args: { _id: string } & IUserUpdate): Promise<IUserDocument | null> {
    let index = users.findIndex((u) => u._id === args._id);
    if (index < 0) {
      throw new Error('not found');
    }

    users[index] = {
      ...users[index],
      ...args,
    };

    return Promise.resolve(users[index] as IUserDocument);
  }

  delete(id: string): Promise<IUserDocument | null> {
    let index = users.findIndex((u) => u._id === id);
    if (index < 0) {
      throw new Error('not found');
    }

    let user = users[index];
    users.splice(index, 1);
    return Promise.resolve(user as IUserDocument);
  }

  changePassword(id: string, password: string): Promise<boolean> {
    let index = users.findIndex((u) => u._id === id);
    if (index < 0) {
      throw new Error('not found');
    }

    users[index] = {
      ...users[index],
      password,
    };

    return Promise.resolve(true);
  }
}
