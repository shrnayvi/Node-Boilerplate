export interface IError {
  message?: string;
  code?: number;
  details: Array<string>;
  error?: any;
  data?: any;
}

export interface ITranslatedError {
  message?: string;
  code?: number;
  error?: any;
  details: Array<string>;
  data?: any;
}
