import { Application } from 'express';

import corsLoader from './corsLoader';
import expressLoader from './expressLoader';
import mongooseLoader from './mongooseLoader';
import './eventLoader';

export default ({ app }: { app: Application }): void => {
  mongooseLoader();
  corsLoader({ app });
  expressLoader({ app });
};
