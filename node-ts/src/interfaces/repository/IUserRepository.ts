import { IUser, IUserDocument, IUserCreate, IUserUpdate } from '../entities/IUser';
import { IPagingArgs, IPaginationData } from '../IPaging';

export interface IUserRepository {
  get(pagingArgs: IPagingArgs): Promise<IPaginationData<IUserDocument[]>>;
  getById(id: string): Promise<IUserDocument | null>;
  getSingleUser(query: any): Promise<IUserDocument | null>;
  create(user: IUserCreate): Promise<IUserDocument>;
  update(id: string, user: IUserUpdate): Promise<IUserDocument | null>;
  delete(id: string): Promise<IUserDocument | null>;
  changePassword(id: string, password: string): Promise<boolean>;
}
