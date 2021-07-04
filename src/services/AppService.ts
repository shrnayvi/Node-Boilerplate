import { injectable } from 'inversify';

import { IAppService } from '../interfaces/services/IAppService';

@injectable()
export default class AppService implements IAppService {
  getStatus = () => 'OK';
}
