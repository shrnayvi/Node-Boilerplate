import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { ITokenArgs, ITokenService, ITokenVerificationInput } from '../interfaces/ITokenService';
import { NotAuthenticatedError } from '../utils/ApiError';

@injectable()
export default class JWTService implements ITokenService {
  generateToken(args: ITokenArgs): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        args.payload,
        args.secretKey,
        {
          expiresIn: args.expiresAt,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  }

  verifyToken(args: ITokenVerificationInput): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(args.token, args.secretKey, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded);
      });
    });
  }

  extractToken(data: any) {
    try {
      let bearerToken = data['authorization'];
      if (!bearerToken) {
        return null;
      }

      const [_, token] = bearerToken.split(' ');
      return token;
    } catch (err) {
      return null;
    }
  }
}
