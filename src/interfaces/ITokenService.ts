export interface ITokenArgs {
  expiresAt: string;
  secretKey: string;
  payload: any;
}

export interface ITokenVerificationInput {
  token: string;
  secretKey: string;
}

export interface ITokenService {
  generateToken(tokenData: ITokenArgs): Promise<string>;
  verifyToken(data: ITokenVerificationInput): Promise<any>;
  extractToken(args: any): string;
}
