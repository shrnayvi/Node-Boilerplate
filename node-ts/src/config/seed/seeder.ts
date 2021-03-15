import seeder from 'mongoose-seed';

import config from '../';
import users from './users';

seeder.connect(config.mongo.url, function () {
  seeder.loadModels(['build/models/user.js']);
  seeder.loadModels(['build/models/userToken.js']);

  // Clear the collections
  seeder.clearModels([config.models.User, config.models.UserToken], () => {
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

var data = [
  {
    model: config.models.User,
    documents: users,
  },
];
