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

@injectable()
export default class UserTokenService implements IUserTokenService {
  private userTokenRepository: IUserTokenRepository;
  private tokenService: ITokenService;
  constructor(
    @inject(TYPES.UserTokenRepository) userTokenRepository: IUserTokenRepository,
    @inject(TYPES.TokenService) tokenService: ITokenService
  ) {
    this.userTokenRepository = userTokenRepository;
    this.tokenService = tokenService;
  }

  getByToken(token: string): Promise<IUserTokenDocument | null> {
    return this.userTokenRepository.getByToken(token);
  }

  async create(args: IUserTokenCreate): Promise<IUserTokenDocument> {
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
  }

  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null> {
    return this.userTokenRepository.deleteByToken(args);
  }

  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean> {
    return this.userTokenRepository.deleteByUserId(args);
  }
}
