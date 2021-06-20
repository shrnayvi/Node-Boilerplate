import { Application } from 'express';

import corsLoader from './corsLoader';
import expressLoader from './expressLoader';
import mongooseLoader from './mongooseLoader';
import i18nLoader from './i18nLoader';
import './eventLoader';

export default ({ app }: { app: Application }): void => {
  mongooseLoader();
  corsLoader({ app });
  i18nLoader({ app });
  expressLoader({ app });
};
