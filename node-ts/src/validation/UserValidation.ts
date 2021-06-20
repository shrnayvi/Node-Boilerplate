import Joi from 'joi';

import config from '../config';
import { IUserUpdate } from '../interfaces/entities/IUser';

const translationKey = config.translationKey;

const messages = {
  firstNameUpdate: {
    'string.base': translationKey.firstNameValidation,
    'string.empty': translationKey.firstNameValidation,
    'string.required': translationKey.firstNameValidation,
  },
  lastNameUpdate: {
    'string.base': translationKey.lastNameValidation,
  },
};

export default class AuthValidation {
  static update() {
    return Joi.object({
      firstName: Joi.string().required().messages(messages.firstNameUpdate),
      lastName: Joi.string().messages(messages.lastNameUpdate),
    });
  }
}
