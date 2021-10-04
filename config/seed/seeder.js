const seeder = require('mongoose-seed');

const vars = require('../vars');
const users = require('./users');

const data = [
  {
    model: vars.models.User,
    documents: users,
  },
];

seeder.connect(vars.mongo.url, function () {
  seeder.loadModels(['models/user.js']);
  seeder.loadModels(['models/userToken.js']);

  // Clear the collections
  seeder.clearModels([vars.models.User, vars.models.UserToken], () => {
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});
