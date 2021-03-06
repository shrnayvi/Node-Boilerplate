import { injectable } from 'inversify';
import bcrypt from 'bcrypt';

import config from '../config';
import { IHashService } from '../interfaces/services/IHashService';

@injectable()
export default class BcryptService implements IHashService {
  async hash(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(Number(config.saltRounds));
    return bcrypt.hash(password, salt);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
