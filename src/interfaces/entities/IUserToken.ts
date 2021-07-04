import { Document } from 'mongoose';

export interface IUserToken {
  token: string;
  expiresIn: Date;
  tokenType: string;
  user: Document['_id'];
}

export interface IUserTokenDocument extends IUserToken, Document {}

export interface IUserTokenCreate {
  payload: any;
  secretKey: string;
  user: string;
  tokenType: IUserToken['tokenType'];
  expiresIn: string;
}

export interface IUserTokenDeleteByToken {
  token: string;
}

export interface IUserTokenDeleteByUserId {
  user: string;
}
