export interface IErrorServiceArgs {
  name?: string;
  operation: string;
  logError: boolean;
  err: any;
}

export interface IErrorService {
  handleError: (args: IErrorServiceArgs) => never;
}
