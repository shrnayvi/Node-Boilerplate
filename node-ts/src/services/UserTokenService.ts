import { injectable, inject } from 'inversify';
import ms from 'ms';

import { TYPES } from '../types';
import {
  IUserTokenDocument,
  IUserTokenCreate,
  IUserTokenDeleteByToken,
  IUserTokenDeleteByUserId,
} from '../interfaces/entities/IUserToken';
import { ITokenService } from '../interfaces/ITokenService';
import { IUserTokenRepository } from '../interfaces/repository/IUserTokenRepository';
import { IUserTokenService } from '../interfaces/services/IUserTokenService';
import { IErrorService } from '../interfaces/services/IErrorService';

@injectable()
export default class UserTokenService implements IUserTokenService {
  private name = 'UserTokenService';
  private userTokenRepository: IUserTokenRepository;
  private tokenService: ITokenService;
  private errorService: IErrorService;

  constructor(
    @inject(TYPES.UserTokenRepository) userTokenRepository: IUserTokenRepository,
    @inject(TYPES.TokenService) tokenService: ITokenService,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this.userTokenRepository = userTokenRepository;
    this.tokenService = tokenService;
    this.errorService = errorService;
  }

  getByToken = async (token: string): Promise<IUserTokenDocument | null> => {
    const operation = 'getByToken';

    try {
      let result = await this.userTokenRepository.getByToken(token);
      return result;
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  async create(args: IUserTokenCreate): Promise<IUserTokenDocument> {
    const operation = 'create';

    try {
      const token = await this.tokenService.generateToken({
        payload: args.payload,
        expiresAt: args.expiresIn,
        secretKey: args.secretKey,
      });

      return this.userTokenRepository.create({
        token,
        expiresIn: new Date(Date.now() + ms(args.expiresIn)),
        user: args.user,
        tokenType: args.tokenType,
      });
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  }

  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null> {
    const operation = 'deleteByToken';

    try {
      return this.userTokenRepository.deleteByToken(args);
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  }

  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean> {
    const operation = 'deleteByUserId';

    try {
      return this.userTokenRepository.deleteByUserId(args);
    } catch (err) {
      this.errorService.handleError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  }
}
