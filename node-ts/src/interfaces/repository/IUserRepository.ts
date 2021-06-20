import { IUser, IUserDocument, IUserCreate, IUserUpdate } from '../entities/IUser';
import { IPagingArgs, IGetAllAndCountResult } from '../IPaging';

export interface IUserRepository {
  getAllAndCount(pagingArgs: IPagingArgs): Promise<IGetAllAndCountResult<IUserDocument[]>>;
  getById(id: string): Promise<IUserDocument | null>;
  getUsers(query: any): Promise<IUserDocument[]>;
  getUser(query: any): Promise<IUserDocument | null>;
  create(user: IUserCreate): Promise<IUserDocument>;
  update(user: { _id: string } & IUserUpdate): Promise<IUserDocument | null>;
  delete(id: string): Promise<IUserDocument | null>;
  changePassword(id: string, password: string): Promise<boolean>;
}
