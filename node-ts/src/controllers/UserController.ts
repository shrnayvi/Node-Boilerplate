import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IUserService } from '../interfaces/services/IUserService';
import { IJoiService } from '../interfaces/services/IJoiService';
import { ILogger } from '../interfaces/ILogger';
import { IUserAuthRequest } from '../interfaces/IUserAuthRequest';
import { IPaginationData } from '../interfaces/IPaging';
import { IUserDocument } from '../interfaces/entities/IUser';
import { AppError } from '../utils/ApiError';
import UserValidation from '../validation/UserValidation';

import { IUserCreate } from '../interfaces/entities/IUser';

const translationKey = config.translationKey;

@injectable()
export default class UserController {
  private name = 'UserController';
  private userService: IUserService;
  private joiService: IJoiService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.UserService) userService: IUserService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger,
    @inject(TYPES.JoiService) joiService: IJoiService
  ) {
    this.userService = userService;
    this.logger = loggerFactory('UserController');
    this.joiService = joiService;
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'getUsers';

    try {
      let result: IPaginationData<IUserDocument[]> = await this.userService.getAll(req.query || {});

      return res.status(200).send({
        message: res.__(translationKey.userListedSuccess),
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'getUser';

    try {
      const _req = req as IUserAuthRequest;
      const _id = req.params._id;

      if (_id !== _req?.user?._id && _req?.user?.role !== config.roles.admin) {
        return res.status(403).send({
          message: res.__(translationKey.forbidden),
          data: { _id },
        });
      }

      let user = await this.userService.getById(_id);
      if (!user) {
        return res.status(404).send({
          message: res.__(translationKey.userNotFound),
          data: {},
        });
      }

      return res.status(200).send({
        message: res.__(translationKey.userListedSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'updateUser';

    try {
      const _req = req as IUserAuthRequest;
      const _id = _req.params._id;
      const args = req.body;

      const firstName = args?.firstName;
      const lastName = args?.lastName;
      if (_id !== _req?.user?._id && _req?.user?.role !== config.roles.admin) {
        return res.status(403).send({
          message: res.__(translationKey.forbidden),
          data: { _id },
        });
      }

      const schema = UserValidation.update();
      await this.joiService.validate({
        schema,
        input: {
          firstName,
          lastName,
        },
      });

      let user = await this.userService.update({
        _id,
        firstName,
        lastName,
      });

      return res.status(200).send({
        message: res.__(translationKey.userUpdateSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'deleteUser';
    const _req = req as IUserAuthRequest;

    try {
      const _id = _req.params._id;
      const data = req.body;

      if (_id === _req?.user?._id) {
        return res.status(403).send({
          message: res.__(translationKey.cannotDeleteOwnAccount),
          data: {
            _id,
          },
        });
      }

      let user = await this.userService.delete(_id);
      if (!user) {
        return res.status(404).send({
          message: res.__(translationKey.userNotFound),
          data: user,
        });
      }

      return res.status(200).send({
        message: res.__(translationKey.userDeleteSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };
}
