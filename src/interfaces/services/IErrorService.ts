import { CustomError } from '../../utils/ApiError';

export interface IErrorArgs {
  name?: string;
  operation: string;
  logError: boolean;
  err: any;
}

export interface IErrorService {
  getError: (args: IErrorArgs) => CustomError;
  throwError: (args: IErrorArgs) => never;
}
