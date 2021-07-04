import {
  IUserLogin,
  IUserCreate,
  IUserLoginResponse,
  IUserSignupResponse,
  IVerifyEmailInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IResendVerificationEmail,
} from '../entities/IUser';

export interface IAuthService {
  signUp(args: IUserCreate): Promise<IUserSignupResponse>;
  login(args: IUserLogin): Promise<IUserLoginResponse>;
  verifyEmail(args: IVerifyEmailInput): Promise<boolean>;
  forgotPassword(args: IForgotPasswordInput): Promise<boolean>;
  resetPassword(args: IResetPasswordInput): Promise<boolean>;
  resendVerificationEmail(args: IResendVerificationEmail): Promise<boolean>;
  renewAccessToken(refreshToken: string): Promise<IUserLoginResponse>;
  logout(refreshToken: string): Promise<boolean>;
}
