import config from '../';

const users = [
  {
    email: 'admin@api.com',
    password: '$2b$10$Hn9fwa3pyp/RlyDU90R.fOd4439PH/lAMHvJVDYlO2lm39oY2hFTq', //password: 'password'
    firstName: 'Admin',
    lastName: 'Api',
    role: config.roles.admin,
    isEmailVerified: true,
  },
  {
    email: 'user@api.com',
    password: '$2b$10$Hn9fwa3pyp/RlyDU90R.fOd4439PH/lAMHvJVDYlO2lm39oY2hFTq', //password: 'password'
    firstName: 'User',
    lastName: 'Api',
    role: config.roles.user,
    isEmailVerified: true,
  },
];

export default users;
