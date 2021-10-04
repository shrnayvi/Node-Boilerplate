const isNil = require('lodash/isNil');
const isString = require('lodash/isNil');

const { UserToken } = require('../models');
const { ValidationError } = require('../utils/ApiError');
const strings = require('../config/strings');
const errorService = require('../services/error.service')();

const userTokenRepository = () => {
  const name = 'userTokenRepository';

  /**
   * Create
   * @param {Object} args
   * @param {string} args.token
   * @param {string} args.tokenType
   * @param {string} args.user
   * @param {Date} args.expiresIn
   * @returns {Promise<UserToken>}
   */
  const create = async (args = {}) => {
    const operation = 'create';

    try {
      const token = args?.token;
      const tokenType = args?.tokenType;
      const user = args?.user;
      const expiresIn = args?.expiresIn;

      const newUserToken = new UserToken({
        token,
        tokenType,
        user,
        expiresIn,
      });

      const entity = await newUserToken.save();

      return entity;
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
   * Get by token
   * @param {Object} args
   * @param {Object} args.token
   * @returns {Promise<User|null>}
   */
  const getByToken = (args = {}) => {
    const operation = 'getByToken';
    const token = args?.token;

    try {
      const errors = [];
      if (isNil(token) || !isString(token)) {
        errors.push(strings.tokenRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }
      return UserToken.findOne({ token });
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
   * Delete by token
   * @param {Object} args
   * @param {string} args.token
   * @returns {Promise<UserToken|null>}
   */
  const deleteByToken = (args = {}) => {
    const operation = 'deleteByToken';

    try {
      const token = args?.token;
      const errors = [];
      if (isNil(token) || !isString(token)) {
        errors.push(strings.tokenRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return UserToken.findOneAndRemove({ token }).exec();
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
   * Delete by user id
   * @param {Object} args
   * @param {string} args.user
   * @returns {boolean}
   */
  const deleteByUserId = (args) => {
    const operation = 'deleteByUserId';

    try {
      const user = args?.user;

      const errors = [];
      if (isNil(user) || !isString(user)) {
        errors.push(strings.userIdRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return UserToken.deleteMany({ user })
        .exec()
        .then((data) => {
          return data.deletedCount ? true : false;
        });
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  return {
    create,
    getByToken,
    deleteByToken,
    deleteByUserId,
  };
};

module.exports = userTokenRepository;
