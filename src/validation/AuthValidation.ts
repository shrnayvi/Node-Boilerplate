import { injectable } from 'inversify';
import Joi from 'joi';

import config from '../config';
import { ValidationError, NotImplementedError } from '../utils/ApiError';
import {
  IUserCreate,
  IUserLogin,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResendVerificationEmail,
  IResetPasswordInput,
} from '../interfaces/entities/IUser';

const translationKey = config.translationKey;

const messages = {
  email: {
    'string.base': translationKey.emailRequired,
    'string.empty': translationKey.emailRequired,
    'string.email': translationKey.invalidEmail,
    'any.required': translationKey.emailRequired,
  },
  password: {
    'string.base': translationKey.passwordValidation,
    'string.empty': translationKey.passwordValidation,
    'any.required': translationKey.passwordValidation,
  },
  firstName: {
    'string.base': translationKey.firstNameValidation,
    'string.empty': translationKey.firstNameValidation,
    'string.required': translationKey.firstNameValidation,
  },
  lastName: {
    'string.base': translationKey.lastNameValidation,
  },
  username: {
    'string.base': translationKey.lastNameValidation,
  },
  token: {
    'string.base': translationKey.tokenValidation,
    'string.empty': translationKey.tokenValidation,
    'string.required': translationKey.tokenValidation,
  },
};

export default class AuthValidation {
  static signUp() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),

      password: Joi.string().required().messages(messages.password),

      firstName: Joi.string().required().messages(messages.firstName),

      lastName: Joi.string().messages(messages.lastName),

      username: Joi.string().messages(messages.lastName),
    });
  }

  static login() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),

      password: Joi.string().required().messages(messages.password),
    });
  }

  static emailVerification() {
    return Joi.object({
      token: Joi.string().required().messages(messages.token),
    });
  }

  static forgotPassword() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),
    });
  }

  static resetPassword() {
    return Joi.object({
      token: Joi.string().required().messages(messages.token),
      password: Joi.string().required().messages(messages.password),
    });
  }

  static resendVerificationEmail() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),
    });
  }
}
