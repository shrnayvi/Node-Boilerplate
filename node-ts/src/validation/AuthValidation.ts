import { injectable } from 'inversify';

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
import { IAuthValidation } from '../interfaces/validation/IAuthValidation';

@injectable()
export default class AuthValidation implements IAuthValidation {
  validateSignUp = (data: IUserCreate) => {
    let errors: Array<string> = [];

    if (!data.email) {
      errors.push('Email required');
    }

    if (!data.password) {
      errors.push('Password required');
    }

    if (!data.firstName) {
      errors.push('Firstname required');
    }

    if (errors.length) {
      throw new ValidationError({
        message: 'Validation Error',
        data: errors,
      });
    }

    return true;
  };

  validateLogin = (data: IUserLogin) => {
    let errors: Array<string> = [];

    if (!data.email) {
      errors.push('Email required');
    }

    if (!data.password) {
      errors.push('Password required');
    }

    if (errors.length) {
      throw new ValidationError({
        message: 'Validation Error',
        data: errors,
      });
    }

    return true;
  };

  validateEmailVerification = (data: IVerifyEmailInput) => {
    let errors: Array<string> = [];

    if (!data.token) {
      errors.push('Token required');
    }

    if (errors.length) {
      throw new ValidationError({
        message: 'Validation Error',
        data: errors,
      });
    }

    return true;
  };

  validateForgotPassword = (data: IForgotPasswordInput) => {
    let errors: Array<string> = [];

    if (!data.email) {
      errors.push('Email required');
    }

    if (errors.length) {
      throw new ValidationError({
        message: 'Validation Error',
        data: errors,
      });
    }

    return true;
  };

  validateResetPasswordValidation = (data: IResetPasswordInput) => {
    let errors: Array<string> = [];

    if (!data.token) {
      errors.push('Token required');
    }

    if (!data.password) {
      errors.push('Password required');
    }

    if (errors.length) {
      throw new ValidationError({
        message: 'Token or password is missing',
        data: errors,
      });
    }

    return true;
  };

  validateResendVerification = (data: IResendVerificationEmail) => {
    throw new NotImplementedError({
      message: 'Resend validation not implemented',
      data,
    });
  };
}
