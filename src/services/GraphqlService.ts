import get from 'lodash/get';
import { injectable, inject } from 'inversify';

import { TYPES } from '../types';
import config from '../config';
import { IGraphql } from '../interfaces/IGraphql';
import { ITokenService } from '../interfaces/ITokenService';
import { IUserService } from '../interfaces/services/IUserService';
import { IUserAuthData } from '../interfaces/IUserAuthRequest';

@injectable()
export default class GraphqlService implements IGraphql {
  private tokenService: ITokenService;
  private userser: IUserService;
  constructor(@inject(TYPES.TokenService) tokenService: ITokenService) {
    this.tokenService = tokenService;
  }

  formatError(err: any) {
    const message = err.message;
    const code = get(err, 'extensions.exception.code');
    const data = get(err, 'extensions.exception.data');
    const details = get(err, 'extensions.exception.details');
    const path = get(err, 'path');

    return {
      message,
      code,
      data,
      path,
      details,
    };
  }

  setContext = async (args: any) => {
    const { req, res } = args;
    let user: IUserAuthData | null;
    try {
      let token = await this.tokenService.extractToken(req.headers);
      let decoded = await this.tokenService.verifyToken({
        token,
        secretKey: config.secretKey,
      });

      user = decoded as IUserAuthData;
    } catch (err) {
      user = null;
    }
    return { req, res, user };
  };
}
