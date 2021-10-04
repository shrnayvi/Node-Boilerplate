const vars = require('../vars');

const users = [
  {
    email: 'admin@api.com',
    username: 'admin',
    password: '$2b$10$Hn9fwa3pyp/RlyDU90R.fOd4439PH/lAMHvJVDYlO2lm39oY2hFTq', // password: 'password'
    firstName: 'Admin',
    lastName: 'Api',
    role: vars.roles.admin,
    isEmailVerified: true,
  },
  {
    email: 'user@api.com',
    username: 'user',
    password: '$2b$10$Hn9fwa3pyp/RlyDU90R.fOd4439PH/lAMHvJVDYlO2lm39oY2hFTq', // password: 'password'
    firstName: 'User',
    lastName: 'Api',
    role: vars.roles.user,
    isEmailVerified: true,
  },
];

module.exports = users;
