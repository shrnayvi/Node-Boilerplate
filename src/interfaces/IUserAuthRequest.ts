import { Request } from 'express';

export interface IUserAuthData {
  _id: string;
  role: string;
}

export interface IUserAuthRequest extends Request {
  user: IUserAuthData;
}
