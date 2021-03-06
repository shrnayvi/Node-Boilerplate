import { injectable } from 'inversify';
import { NotImplementedError } from '../utils/ApiError';

import { IEmailService } from '../interfaces/services/IEmailService';

@injectable()
export default class EmailService implements IEmailService {
  async sendMail(data: any): Promise<any> {
    throw new NotImplementedError({
      message: 'Email service not implemented',
    });
  }
}
