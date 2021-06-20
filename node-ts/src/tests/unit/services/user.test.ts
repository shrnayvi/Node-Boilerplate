import container from '../../../inversify.config';
import { TYPES } from '../../../types';

import config from '../../../config';
import { IUserRepository } from '../../../interfaces/repository/IUserRepository';
import { IUserService } from '../../../interfaces/services/IUserService';
import { IPaginationData } from '../../../interfaces/IPaging';
import { IUserDocument } from '../../../interfaces/entities/IUser';
import UserService from '../../../services/UserService';

import UserRepositoryMock from '../mock/UserRepository';
import { users as mockedUsers } from '../mock/data';

import { ValidationError, NotFoundError } from '../../../utils/ApiError';

describe('User service', () => {
  container.rebind(TYPES.UserRepository).to(UserRepositoryMock);
  const userService: IUserService = container.get<IUserService>(TYPES.UserService);

  describe('Get Users', () => {
    it('should return user of length users from mock data', async () => {
      let users: IPaginationData<IUserDocument[]> = await userService.getAll({});
      expect(users.data.length).toBe(mockedUsers.length);
    });
  });

  describe('Update User', () => {
    it('should update user', async () => {
      const _id = mockedUsers[0]._id;

      await userService.update({ _id, firstName: 'Updated first name' });
      expect(mockedUsers[0].firstName).toBe('Updated first name');
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      const _id = mockedUsers[0]._id;

      await userService.delete(_id);
      expect(mockedUsers.findIndex((u) => u._id === _id)).toBeLessThan(0);
    });
  });
});
