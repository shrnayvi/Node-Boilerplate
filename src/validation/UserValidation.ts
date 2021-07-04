import Joi from 'joi';

import config from '../config';
import { IUserUpdate } from '../interfaces/entities/IUser';

const translationKey = config.translationKey;

const messages = {
  firstNameUpdate: {
    'string.base': translationKey.firstNameValidation,
    'string.empty': translationKey.firstNameValidation,
    'string.required': translationKey.firstNameValidation,
    'any.required': translationKey.firstNameValidation,
  },
  lastNameUpdate: {
    'string.base': translationKey.lastNameValidation,
  },
  email: {
    'string.base': translationKey.emailRequired,
    'string.empty': translationKey.emailRequired,
    'string.required': translationKey.emailRequired,
    'any.required': translationKey.emailRequired,
    'string.email': translationKey.invalidEmail,
  },
  password: {
    'string.base': translationKey.passwordValidation,
    'string.empty': translationKey.passwordValidation,
    'string.required': translationKey.passwordValidation,
    'any.required': translationKey.passwordValidation,
  },
  firstNameCreate: {
    'string.base': translationKey.firstNameValidation,
    'string.empty': translationKey.firstNameValidation,
    'string.required': translationKey.firstNameValidation,
    'any.required': translationKey.firstNameValidation,
  },
  lastNameCreate: {
    'string.base': translationKey.lastNameValidation,
  },
  role: {
    'string.base': translationKey.roleValidation,
  },
};

export default class UserValidation {
  static update() {
    return Joi.object({
      firstName: Joi.string().required().messages(messages.firstNameUpdate),
      lastName: Joi.string().messages(messages.lastNameUpdate),
    });
  }

  static create() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),
      password: Joi.string().required().messages(messages.password),
      firstName: Joi.string().required().messages(messages.firstNameCreate),
      lastName: Joi.string().messages(messages.lastNameCreate),
      role: Joi.string().messages(messages.role),
    });
  }

  static changePassword() {
    return Joi.object({
      oldPassword: Joi.string().required().messages(messages.password),
      password: Joi.string().required().messages(messages.password),
    });
  }
}
