const vars = require('../config/vars');
const strings = require('../config/strings');
const { userEmitter } = require('../subscribers');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/ApiError');
const logger = require('../utils/winstonLogger')('authService');
const userRepository = require('../repository/user.repository')();
const jwtService = require('../services/jwt.service')();
const hashService = require('../services/bcrypt.service')();
const emailService = require('../services/email.service')();
const userTokenService = require('../services/userToken.service')();
const errorService = require('../services/error.service')();

const authService = () => {
  const name = 'authService';

  /**
   * Sign up/Register
   * @param {Object} args
   * @param {string} args.email
   * @param {string} args.password
   * @param {string} args.username
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @returns {Object}
   */
  const signUp = async (args) => {
    const operation = 'signUp';
    const role = vars.roles.user;
    const email = args?.email;
    const username = args?.username;
    const password = args?.password;
    const firstName = args?.firstName;
    const lastName = args?.lastName;

    try {
      let hashedPassword = await hashService.hash(password, 12);

      let user = await userRepository.create({
        email,
        firstName,
        lastName,
        username,
        role,
        password: hashedPassword,
      });

      // Emit event for signup
      userEmitter.emit(vars.events.onSignUp, user);

      return {
        _id: user._id,
      };
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Login
   * @param {Object} args
   * @param {string} args.email
   * @param {string} args.password
   */
  const login = async (args) => {
    const operation = 'login';
    try {
      const email = args.email;
      const password = args.password;

      const user = await userRepository.findOne({ email, selectPassword: true });

      if (!user) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.badCredentials],
          data: { email },
        });
      }

      const isPasswordCorrect = await hashService.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.badCredentials],
          data: { email },
        });
      }

      const payload = {
        _id: user._id,
        role: user.role,
      };

      const token = await jwtService.generateToken({
        payload,
        expiresAt: vars.authTokenExpiration,
        secretKey: vars.secretKey,
      });

      const refreshToken = await userTokenService.create({
        payload,
        expiresIn: vars.refreshTokenExpiration,
        secretKey: vars.refreshTokenKey,
        user: user._id,
        tokenType: vars.tokenType.refresh,
      });

      return {
        _id: user._id,
        token,
        role: user.role,
        refreshToken: refreshToken.token,
      };
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Verify email
   * @param {Object} args
   * @param {string} args.token
   * @returns {Promise<boolean>}
   */
  const verifyEmail = async (args) => {
    const operation = 'verifyEmail';

    try {
      const token = args.token;

      let decoded = await jwtService.verifyToken({ token, secretKey: vars.secretKey });
      let { email } = decoded;

      if (!email) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.tokenInvalid],
          data: args,
        });
      }

      let user = await userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: {
            email,
          },
        });
      }

      let updatedUser = await userRepository.update({
        _id: user._id,
        isEmailVerified: true,
      });

      return true;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Forgot password
   * @param {Object} args
   * @param {string} args.email
   * @returns {Promise<boolean>}
   */
  const forgotPassword = async (args) => {
    const operation = 'forgotPassword';

    try {
      const email = args.email;

      const user = await userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: args,
        });
      }

      const token = await jwtService.generateToken({
        payload: { _id: user._id },
        expiresAt: vars.forgotPasswordTokenExpiration,
        secretKey: vars.secretKey,
      });

      // send email
      emailService
        .sendMail({
          email: user.email,
          token,
        })
        .catch((err) => {
          logger.error({ operation, message: 'Error sending email', data: args });
        });

      return true;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Reset password
   * @param {Object} args
   * @param {string} args.token
   * @param {string} args.password
   * @returns {Promise<boolean>}
   */
  const resetPassword = async (args) => {
    const operation = 'resetPassword';
    try {
      const token = args.token;
      const password = args.password;

      let decoded = await jwtService.verifyToken({
        token,
        secretKey: vars.secretKey,
      });

      if (decoded._id) {
        let user = await userRepository.getById({ _id: decoded._id });
        if (!user) {
          throw new NotFoundError({
            message: strings.userNotFound,
            details: [strings.userNotFound],
            data: { _id: decoded._id },
          });
        }

        await userRepository.update({
          _id: decoded._id,
          password,
        });

        return true;
      }

      return false;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Resend verification email
   * @param {Object} args
   * @param {string} args.email
   * @returns {Promise<boolean>}
   */
  const resendVerificationEmail = async (args) => {
    const operation = 'resendVerificationEmail';

    try {
      const email = args.email;

      const user = await userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: args,
        });
      }

      emailService
        .sendMail({
          email,
        })
        .then((_) =>
          logger.info({
            message: 'Resend verification email sent',
            operation: 'resendVerificationEmail',
            data: args,
          })
        )
        .catch((err) => logger.error({ operation, message: err.message, data: args }));

      return true;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  const renewAccessToken = async (refreshToken) => {
    const operation = 'renewAccessToken';

    try {
      const tokenDoc = await userTokenService.getByToken(refreshToken);
      if (!tokenDoc) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.tokenInvalid],
          data: { refreshToken },
        });
      }

      const token = tokenDoc.token;

      const decoded = await jwtService
        .verifyToken({
          token,
          secretKey: vars.refreshTokenKey,
        })
        .catch((err) =>
          logger.error({ operation: 'renewAccessToken', message: 'Invalid refresh token', data: { refreshToken } })
        );

      if (!decoded) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.tokenInvalid],
          data: { refreshToken },
        });
      }

      const payload = {
        _id: decoded?._id,
        role: decoded?.role,
      };

      const newAccessToken = await jwtService.generateToken({
        payload: payload,
        expiresAt: vars.authTokenExpiration,
        secretKey: vars.secretKey,
      });

      return {
        token: newAccessToken,
        refreshToken,
        ...payload,
      };
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  const logout = async (refreshToken) => {
    const operation = 'logout';

    return userTokenService
      .deleteByToken({
        token: refreshToken,
      })
      .then((data) => (data ? true : false))
      .catch((err) => {
        errorService.throwError({
          err,
          operation,
          name,
          logError: false,
        });
      });
  };

  return {
    signUp,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    renewAccessToken,
    logout,
  };
};

module.exports = authService;
