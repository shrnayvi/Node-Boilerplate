import { Document } from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserCreate {
  email: IUser['email'];
  password: IUser['password'];
  firstName: IUser['firstName'];
  lastName?: IUser['lastName'];
  role?: IUser['role'];
  username?: IUser['username'];
}

export interface IUserUpdate {
  firstName?: IUser['firstName'];
  lastName?: IUser['lastName'];
  isEmailVerified?: IUser['isEmailVerified'];
}

//use if has populated doc
//export interface IUserPopulatedDocument extends IUserDocument {};

export interface IUserLogin {
  email: IUser['email'];
  password: string;
}

export interface IUserLoginResponse {
  _id: string;
  token: string;
  refreshToken: string;
  role: string;
}

export interface IUserSignupResponse {
  _id: string;
  message?: string;
}

export interface IVerifyEmailInput {
  token: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}

export interface IResendVerificationEmail {
  email: string;
}

export interface ITokenPayload {
  _id: string;
  role: string;
}
