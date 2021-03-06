import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../types';
import { IAppService } from '../interfaces/services/IAppService';

import { AppError } from '../utils/ApiError';

@injectable()
export default class AppController {
  private appService: IAppService;

  constructor(@inject(TYPES.AppService) appService: IAppService) {
    this.appService = appService;
  }

  getStatus = async (req: Request, res: Response) => {
    const status: string = await this.appService.getStatus();

    return res.status(200).send({ message: status });
  };

  getAppError = async (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError({
      message: 'Internal Server Error',
      data: {},
    });

    next(error);
  };
}
