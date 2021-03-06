import { IPagingArgs, IPagingResult } from '../IPaging';

export interface IBaseService {
  getAllPagingData(args: IPagingArgs): Promise<IPagingResult>;
}
