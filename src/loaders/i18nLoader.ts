import { Application } from 'express';
import i18n from 'i18n';
import config from '../config';

export default ({ app }: { app: Application }): void => {
  app.use(i18n.init);

  i18n.configure({
    locales: Object.values(config.languages),
    directory: `${__dirname}/../../locales`,
    defaultLocale: config.languages.english,
    autoReload: true,
    updateFiles: false,
  });
};
