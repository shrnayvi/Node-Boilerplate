import { userEmitter } from './';
import config from '../config';
import container from '../inversify.config';
import { TYPES } from '../types';
import { ILogger } from '../interfaces/ILogger';
import { ITokenService } from '../interfaces/ITokenService';
import { IEmailService } from '../interfaces/services/IEmailService';

const logger: ILogger = container.get<ILogger>(TYPES.Logger);
logger.init('userEmitter');

const jwtService: ITokenService = container.get<ITokenService>(TYPES.TokenService);
const emailService: IEmailService = container.get<IEmailService>(TYPES.EmailService);

/* On User Signup */
userEmitter.on(config.events.onSignUp, async (userData: any) => {
  const operation = config.events.onSignUp;
  logger.info({ operation, message: 'User onSignUp emitted', data: userData });
  let payload = { email: userData.email };
  const token = await jwtService.generateToken({
    payload,
    secretKey: config.secretKey,
    expiresAt: config.verificationEmailTokenExpiration,
  });

  logger.info({ operation, message: 'Token created', data: userData });

  // send email to user (not implemented)
  emailService
    .sendMail(userData)
    .then((data) => logger.info({ operation, message: 'Verification email sent', data: userData }))
    .catch((err) => logger.error({ operation, message: 'Error sending verification email', data: err }));
});

export default userEmitter;
