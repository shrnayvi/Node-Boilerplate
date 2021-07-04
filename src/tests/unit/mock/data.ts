import config from '../../../config';
import { IUser } from '../../../interfaces/entities/IUser';
import { IUserToken } from '../../../interfaces/entities/IUserToken';

export interface IUserM extends IUser {
  _id: string;
}

export interface IUserTokenM extends IUserToken {
  _id: string;
}

export const users: IUserM[] = [
  {
    _id: '1',
    email: 'test@test.com',
    password: 'password',
    role: 'user',
    username: 'test1',
    firstName: 'first',
    lastName: 'last',
    isEmailVerified: true,
  },
];

export const userTokens: IUserTokenM[] = [
  {
    _id: '1',
    token: 'token',
    tokenType: config.tokenType.refresh,
    expiresIn: new Date(),
    user: users[0],
  },
];

export const existingUserEmail = users[0].email;
