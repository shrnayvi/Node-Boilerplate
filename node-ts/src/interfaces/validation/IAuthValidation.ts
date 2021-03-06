import {
  IUserCreate,
  IUserLogin,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResendVerificationEmail,
  IResetPasswordInput,
} from '../entities/IUser';

export interface IAuthValidation {
  validateSignUp(data: IUserCreate): boolean;
  validateLogin(data: IUserLogin): boolean;
  validateEmailVerification(data: IVerifyEmailInput): boolean;
  validateForgotPassword(data: IForgotPasswordInput): boolean;
  validateResetPasswordValidation(data: IResetPasswordInput): boolean;
  validateResendVerification(data: IResendVerificationEmail): boolean;
}
