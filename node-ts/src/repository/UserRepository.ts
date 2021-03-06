import { injectable } from 'inversify';

import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { IUserDocument, IUserCreate, IUserUpdate } from '../interfaces/entities/IUser';
import { IPagingArgs, IPaginationData } from '../interfaces/IPaging';
import User from '../models/user';
import Paging from '../utils/Paging';

@injectable()
export default class UserRepository implements IUserRepository {
  async get(pagingArgs: IPagingArgs): Promise<IPaginationData<IUserDocument[]>> {
    const { skip, limit, sort, query } = pagingArgs;

    const data = await User.find(query)
      .skip(<number>skip)
      .limit(<number>limit)
      .sort(sort);

    const total = await User.countDocuments(query);
    const paging = Paging.getPagingResult(pagingArgs, { total });

    return {
      paging,
      data,
    };
  }

  getById = async (id: string): Promise<IUserDocument | null> => User.findById(id);

  getSingleUser = async (query: any): Promise<IUserDocument | null> => User.findOne(query);

  create(user: IUserCreate): Promise<IUserDocument> {
    const newUser: IUserDocument = new User(user);
    return newUser.save();
  }

  update(id: string, user: IUserUpdate): Promise<IUserDocument | null> {
    return User.findOneAndUpdate({ _id: id }, user, { new: true }).exec();
  }

  delete(id: string): Promise<IUserDocument | null> {
    return User.findOneAndRemove({ _id: id }).exec();
  }

  async changePassword(id: string, password: string): Promise<boolean> {
    return User.findOneAndUpdate({ _id: id }, { password }, { new: true })
      .exec()
      .then(() => true);
  }
}
