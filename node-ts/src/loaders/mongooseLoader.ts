import mongoose from 'mongoose';

import config from '../config';
import { TYPES } from '../types';
import container from '../inversify.config';
import { ILogger } from '../interfaces/ILogger';

const logger = container.get<ILogger>(TYPES.Logger);
logger.init('mongooseLoader');

export default () => {
  const connection = config.mongo.url;
  mongoose.Promise = global.Promise;
  mongoose.connect(connection, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  mongoose.connection
    .once('open', () => {
      logger.info({
        operation: 'mongooseConnection',
        message: 'Database connected',
      });
    })
    .on('error', (err) => {
      logger.info({
        operation: 'mongooseConnection',
        message: 'Error Connecting to the database',
        data: err,
      });
    });
};
