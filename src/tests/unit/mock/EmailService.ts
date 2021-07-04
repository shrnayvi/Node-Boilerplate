import { injectable } from 'inversify';

import { IEmailService } from '../../../interfaces/services/IEmailService';

@injectable()
export default class BcryptServiceMock implements IEmailService {
  async sendMail(data: any): Promise<any> {
    return;
  }
}
