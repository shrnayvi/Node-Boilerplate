import app from './app';
import config from './config';

import { TYPES } from './types';
import container from './inversify.config';
import { ILogger } from './interfaces/ILogger';

const logger = container.get<ILogger>(TYPES.Logger);
logger.init('server');

app.listen(config.port, () => {
  logger.info({
    operation: 'serverConnection',
    message: `App is listening to port ${config.port}`,
  });
});
