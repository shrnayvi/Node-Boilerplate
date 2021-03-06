import { IUser, IUserDocument, IUserCreate, IUserUpdate } from '../entities/IUser';
import { IPagingArgs, IPaginationData } from '../../interfaces/IPaging';

export interface IUserService {
  getAll(filters?: any): Promise<IPaginationData<IUserDocument[]>>;
  getById(id: string): Promise<IUserDocument | null>;
  create(user: IUserCreate): Promise<IUserDocument>;
  update(id: string, user: IUserUpdate): Promise<IUserDocument | null>;
  delete(id: string): Promise<IUserDocument | null>;
}
