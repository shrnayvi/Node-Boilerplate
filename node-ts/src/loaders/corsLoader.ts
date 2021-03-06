import { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import config from '../config';

export default ({ app }: { app: Application }): void => {
  const origins = config.origins;

  const corsOptions: CorsOptions = {
    origin: origins,
    credentials: true,
  };

  app.use(cors(corsOptions));
};
