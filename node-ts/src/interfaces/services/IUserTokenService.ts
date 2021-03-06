import {
  IUserTokenDocument,
  IUserTokenCreate,
  IUserTokenDeleteByToken,
  IUserTokenDeleteByUserId,
} from '../entities/IUserToken';

export interface IUserTokenService {
  getByToken(token: string): Promise<IUserTokenDocument | null>;
  create(args: IUserTokenCreate): Promise<IUserTokenDocument>;
  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null>;
  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean>;
}
