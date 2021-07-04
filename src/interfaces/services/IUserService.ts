import { IUser, IUserDocument, IUserCreate, IUserUpdate, IChangePassword } from '../entities/IUser';
import { IPagingArgs, IPaginationData } from '../../interfaces/IPaging';

export interface IUserService {
  getAll(filters?: any): Promise<IPaginationData<IUserDocument[]>>;
  getById(id: string): Promise<IUserDocument | null>;
  create(args: IUserCreate): Promise<IUserDocument>;
  update(args: { _id: string } & IUserUpdate): Promise<IUserDocument | null>;
  delete(id: string): Promise<IUserDocument | null>;
  changePassword(args: { _id: string } & IChangePassword): Promise<boolean>;
}
