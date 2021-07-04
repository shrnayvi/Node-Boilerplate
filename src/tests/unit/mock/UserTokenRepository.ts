import { injectable } from 'inversify';

import { IUserTokenRepository } from '../../../interfaces/repository/IUserTokenRepository';
import {
  IUserToken,
  IUserTokenDocument,
  IUserTokenDeleteByToken,
  IUserTokenDeleteByUserId,
} from '../../../interfaces/entities/IUserToken';
import UserToken from '../../../models/userToken';
import { IUserTokenM, userTokens } from './data';

@injectable()
export default class UserTokenRepository implements IUserTokenRepository {
  create(args: IUserToken): Promise<IUserTokenDocument> {
    let newUserToken = {
      ...args,
      _id: 'newUserTokenId',
    };

    userTokens.push(newUserToken as IUserTokenM);
    return Promise.resolve(newUserToken as IUserTokenDocument);
  }

  async getByToken(token: string): Promise<IUserTokenDocument | null> {
    let userToken = userTokens.find((u) => u.token === token);
    if (token) {
      return Promise.resolve(userToken as IUserTokenDocument);
    }
    return Promise.resolve(null);
  }

  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null> {
    let index = userTokens.findIndex((u) => u.token === args.token);
    if (index < 0) {
      throw new Error('not found');
    }

    let userToken = userTokens[index];
    userTokens.splice(index, 1);
    return Promise.resolve(userToken as IUserTokenDocument);
  }

  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean> {
    let index = userTokens.findIndex((u) => u.user === args.user);
    if (index < 0) {
      throw new Error('not found');
    }

    let userToken = userTokens[index];
    userTokens.splice(index, 1);
    return Promise.resolve(true);
  }
}
