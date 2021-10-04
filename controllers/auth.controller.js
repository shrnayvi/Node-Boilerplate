const ms = require('ms');

const vars = require('../config/vars');
const strings = require('../config/strings');
const authService = require('../services/auth.service')();
const userService = require('../services/user.service')();
const joiService = require('../services/joi.service')();
const authValidation = require('../validation/auth.validation');
const errorService = require('../services/error.service')();

const authController = () => {
  const name = 'authController';

  const register = async (req, res, next) => {
    const operation = 'register';

    try {
      const args = req.body;

      const email = args.email;
      const password = args.password;
      const firstName = args.firstName;
      const lastName = args.lastName;

      const schema = authValidation.signUp;

      await joiService.validate({
        schema,
        input: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      const signUpResponse = await authService.signUp({
        email,
        password,
        firstName,
        lastName,
      });

      return res.status(200).send({
        message: strings.registerSuccess,
        data: signUpResponse,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const login = async (req, res, next) => {
    const operation = 'login';

    try {
      const args = req.body;
      const email = args.email;
      const password = args.password;

      const schema = authValidation.login;

      await joiService.validate({
        schema,
        input: {
          email,
          password,
        },
      });

      const loginResponse = await authService.login({
        email,
        password,
      });

      const options = {
        maxAge: ms(vars.refreshTokenExpiration),
        httpOnly: true,
      };

      res.cookie(vars.refreshTokenCookieName, loginResponse.refreshToken, options);

      return res.status(200).send({
        message: strings.loginSuccess,
        data: loginResponse,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const verifyEmail = async (req, res, next) => {
    const operation = 'verifyEmail';

    try {
      const args = req.body;
      const token = args?.token;

      const schema = authValidation.emailVerification;

      await joiService.validate({
        schema,
        input: {
          token,
        },
      });

      let response = await authService.verifyEmail({
        token,
      });

      return res.status(200).send({
        message: strings.verifyEmailSuccess,
        data: response,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const forgotPassword = async (req, res, next) => {
    const operation = 'forgotPassword';

    try {
      const _id = req.params._id;
      const args = req.body;
      const email = args?.email;

      const schema = authValidation.forgotPassword;
      await joiService.validate({
        schema,
        input: {
          email,
        },
      });

      let response = await authService.forgotPassword({
        email,
      });

      return res.status(200).send({
        message: strings.forgotPasswordSuccess,
        data: response,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const resetPassword = async (req, res, next) => {
    const operation = 'resetPassword';

    try {
      const _id = req.params._id;
      const args = req.body;
      const token = args?.token;
      const password = args?.password;

      const schema = authValidation.resetPassword;
      await joiService.validate({
        schema,
        input: {
          token,
          password,
        },
      });

      let response = await authService.resetPassword({
        token,
        password,
      });

      return res.status(200).send({
        message: strings.resetPasswordSuccess,
        data: response,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const resendEmailVerification = async (req, res, next) => {
    const operation = 'resendEmailVerification';

    try {
      const _id = req.params._id;
      const args = req.body;
      const email = args?.email;

      const schema = authValidation.resendVerificationEmail;
      await joiService.validate({
        schema,
        input: {
          email,
        },
      });

      let response = await authService.resendVerificationEmail({
        email,
      });

      return res.status(200).send({
        message: strings.resendEmailVerificationSuccess,
        data: response,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const logout = async (req, res, next) => {
    const operation = 'logout';

    try {
      const cookie = req?.cookies || {};

      const refreshToken = cookie[vars.refreshTokenCookieName];
      if (refreshToken) {
        return authService.logout(refreshToken);
      }
      return res.status(200).send({
        message: strings.logoutSuccess,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const getLoggedInUser = async (req, res, next) => {
    const operation = 'getLoggedInUser';
    const _req = req;

    try {
      const _id = _req.user?._id;

      let user = await userService.getById({ _id });

      return res.status(200).send({
        message: strings.userListedSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  return {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    getLoggedInUser,
  };
};

module.exports = authController;
