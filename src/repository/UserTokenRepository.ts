import { injectable } from 'inversify';

import { IUserTokenRepository } from '../interfaces/repository/IUserTokenRepository';
import {
  IUserToken,
  IUserTokenDocument,
  IUserTokenDeleteByToken,
  IUserTokenDeleteByUserId,
} from '../interfaces/entities/IUserToken';
import UserToken from '../models/userToken';

@injectable()
export default class UserTokenRepository implements IUserTokenRepository {
  create(userToken: IUserToken): Promise<IUserTokenDocument> {
    const newUserToken: IUserTokenDocument = new UserToken(userToken);
    return newUserToken.save();
  }

  async getByToken(token: string): Promise<IUserTokenDocument | null> {
    return UserToken.findOne({ token });
  }

  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null> {
    return UserToken.findOneAndRemove({ token: args.token }).exec();
  }

  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean> {
    return UserToken.deleteMany({ user: args.user })
      .exec()
      .then((data) => {
        return data.deletedCount ? true : false;
      });
  }
}
