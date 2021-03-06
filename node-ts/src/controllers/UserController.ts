import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IUserService } from '../interfaces/services/IUserService';
import { ILogger } from '../interfaces/ILogger';
import { IUserAuthRequest } from '../interfaces/IUserAuthRequest';

import { AppError } from '../utils/ApiError';

import { IUserCreate } from '../interfaces/entities/IUser';

@injectable()
export default class AuthController {
  private userService: IUserService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.UserService) userService: IUserService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.userService = userService;
    this.logger = loggerFactory('UserController');
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'getUsers';

    try {
      let users = await this.userService.getAll();
      return res.status(200).send({
        message: 'User listed successfully',
        data: users,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  getSingleUser = async (eReq: Request, res: Response, next: NextFunction) => {
    const operation = 'getSingleUser';

    try {
      const req = eReq as IUserAuthRequest;
      const _id = req.params._id;

      if (_id !== req?.user?._id && req?.user?.role !== config.roles.admin) {
        return res.status(403).send({
          message: 'Forbidden',
          data: { _id },
        });
      }

      let user = await this.userService.getById(_id);
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
          data: {},
        });
      }

      return res.status(200).send({
        message: 'User listed successfully',
        data: user,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  updateUser = async (eReq: Request, res: Response, next: NextFunction) => {
    const operation = 'updateUser';

    try {
      const req = eReq as IUserAuthRequest;
      const _id = req.params._id;
      const data = req.body;

      // TODO: Validate using Joi?

      if (_id !== req?.user?._id && req?.user?.role !== config.roles.admin) {
        return res.status(403).send({
          message: 'Forbidden',
          data: { _id },
        });
      }

      let user = await this.userService.update(_id, data);

      return res.status(200).send({
        message: 'User updated',
        data: user,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };

  deleteUser = async (eReq: Request, res: Response, next: NextFunction) => {
    const operation = 'deleteUser';
    const req = eReq as IUserAuthRequest;

    try {
      const _id = req.params._id;
      const data = req.body;

      if (_id === req?.user?._id) {
        return res.status(403).send({
          message: 'Cannot delete own account',
          data: {
            _id,
          },
        });
      }

      let user = await this.userService.delete(_id);
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
          data: user,
        });
      }

      return res.status(200).send({
        message: 'User deleted',
        data: user,
      });
    } catch (err) {
      this.logger.error({
        operation,
        message: err.message,
        data: err,
      });
      next(err);
    }
  };
}
