import { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import routes from '../routes';
import errorHandler from '../middlewares/errorHandler';

export default ({ app }: { app: Application }): void => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.text({ type: 'text/plain' }));
  app.use(cookieParser());

  app.use('/v1', routes);

  app.use(errorHandler);
};
