import { injectable } from 'inversify';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';

import config from '../config';
import User from '../models/user';
import Paging from '../utils/Paging';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { IUserDocument, IUserCreate, IUserUpdate } from '../interfaces/entities/IUser';
import { IPagingArgs, IGetAllAndCountResult } from '../interfaces/IPaging';
import { ValidationError, NotFoundError } from '../utils/ApiError';

@injectable()
export default class UserRepository implements IUserRepository {
  async getAllAndCount(pagingArgs: IPagingArgs): Promise<IGetAllAndCountResult<IUserDocument[]>> {
    const { skip, limit, sort, query } = pagingArgs;

    const data = await User.find(query)
      .skip(<number>skip)
      .limit(<number>limit)
      .sort(sort);

    const total = await User.countDocuments(query);
    const paging = Paging.getPagingResult(pagingArgs, { total });

    return {
      count: total,
      rows: data,
    };
  }

  getById = async (id: string): Promise<IUserDocument | null> => User.findById(id);

  getUsers = async (query: any): Promise<IUserDocument[]> => User.find(query);

  getUser = async (query: any): Promise<IUserDocument | null> => User.findOne(query);

  create(user: IUserCreate): Promise<IUserDocument> {
    const email = user.email;
    const username = user.username;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const password = user.password;
    const role = user.password ?? config.roles.user;
    const isEmailVerified = false;

    const errors = [];
    if (isNil(email) || !isString(email)) {
      errors.push(config.translationKey.emailRequired);
    }

    if (isNil(firstName) || !isString(firstName)) {
      errors.push(config.translationKey.firstNameValidation);
    }

    if (isNil(password) || !isString(password)) {
      errors.push(config.translationKey.passwordValidation);
    }

    if (errors.length) {
      throw new ValidationError({
        message: config.translationKey.validationError,
        details: errors,
      });
    }

    const newUser: IUserDocument = new User(user);
    return newUser.save();
  }

  update = async (user: { _id: string } & IUserUpdate): Promise<IUserDocument | null> => {
    const _id = user?._id;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const isEmailVerified = user?.isEmailVerified;

    const errors = [];
    if (isNil(_id) || !isString(_id)) {
      errors.push(config.translationKey.idRequired);
    }

    if (isNil(firstName) || !isString(firstName)) {
      errors.push(config.translationKey.firstNameValidation);
    }

    if (!isNil(isEmailVerified) && !isBoolean(isEmailVerified)) {
      errors.push(config.translationKey.emailVerifiedInputValidation);
    }

    if (!isNil(lastName) && !isString(lastName)) {
      errors.push(config.translationKey.lastNameValidation);
    }

    if (errors.length) {
      throw new ValidationError({
        message: config.translationKey.validationError,
        details: errors,
      });
    }

    const foundUser: IUserDocument | null = await this.getUser({ _id });

    if (!foundUser) {
      throw new NotFoundError({
        message: config.translationKey.userNotFound,
        details: [config.translationKey.userNotFound],
        data: { _id },
      });
    }

    let data = <IUserUpdate>merge(foundUser, {
      firstName,
      lastName,
      isEmailVerified,
    });

    return User.findOneAndUpdate({ _id }, data, { new: true }).exec();
  };

  delete(id: string): Promise<IUserDocument | null> {
    return User.findOneAndRemove({ _id: id }).exec();
  }

  async changePassword(id: string, password: string): Promise<boolean> {
    let errors = [];
    if (isEmpty(id)) {
      errors.push(config.translationKey.idRequired);
    }

    if (isEmpty(password)) {
      errors.push(config.translationKey.passwordValidation);
    }

    if (errors.length) {
      throw new ValidationError({
        message: config.translationKey.validationError,
        details: errors,
      });
    }

    return User.findOneAndUpdate({ _id: id }, { password }, { new: true })
      .exec()
      .then(() => true);
  }
}
