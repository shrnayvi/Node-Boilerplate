const { isBoolean, merge, isArray, isString, isNil, isEmpty, get, omit } = require('lodash');

const paging = require('../utils/paging');
const vars = require('../config/vars');
const strings = require('../config/strings');
const { User } = require('../models');
const { roles } = require('../config/vars');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/ApiError');
const hashService = require('../services/bcrypt.service')();
const errorService = require('../services/error.service')();

const userRepository = () => {
  const name = 'userRepository';

  /**
   * Get all documents
   * @param {Object} args
   * @param {Object} args.query
   * @param {number} args.skip
   * @param {number} args.limit
   * @param {string} args.sort
   * @returns {Promise<{ count: number, rows: User[] }>}
   */
  const getAllAndCount = async (args = {}) => {
    const operation = 'getAllAndCount';

    const { skip, limit, sort, query } = args;

    try {
      const data = await User.find(query).skip(skip).limit(limit).sort(sort);

      const total = await User.countDocuments(query);

      return {
        count: total,
        rows: data,
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
   * Get user by id
   * @param {Object} args
   * @param {number} args._id
   * @returns {Promise<User|null>}
   */
  const getById = async (args = {}) => {
    const operation = 'getById';

    const _id = args?._id;

    try {
      const errors = [];
      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return User.findById(args?._id);
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
   * Get all documents
   * @param {any} args
   * @returns {Promise<User[]>}
   */
  const getAll = async (args) => {
    const operation = 'getAll';
    return User.find(args).catch((err) => {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    });
  };

  /**
   * Find single user
   * @param {Object} args - The args object
   * @param {boolean=} args.selectPassword
   * @returns {User | null}
   */
  const findOne = async (args) => {
    const operation = 'findOne';

    try {
      const selectPassword = args?.selectPassword;
      const _args = omit(args, ['selectPassword']);

      let user;
      if (args?.selectPassword) {
        user = await User.findOne(_args).select('+password');
      } else {
        user = await User.findOne(_args);
      }

      return user;
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
   * Create new user
   * @param {Object} args
   * @param {string=} args.username
   * @param {string} args.email
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @param {string} args.password
   * @param {string=} args.role
   * @returns {Promise<User>}
   */
  const create = async (user) => {
    const operation = 'create';
    try {
      let username = user?.username;
      const email = user?.email;
      const firstName = user?.firstName;
      const lastName = user?.lastName;
      const password = user?.password;
      const role = user?.role ?? roles.user;
      const isEmailVerified = false;

      const errors = [];
      if (isNil(email) || !isString(email)) {
        errors.push(strings.emailRequired);
      }

      if (isNil(firstName) || !isString(firstName)) {
        errors.push(strings.firstNameValidation);
      }

      if (isNil(password) || !isString(password)) {
        errors.push(strings.passwordValidation);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      let foundUser = await User.findOne({ email });

      if (foundUser) {
        throw new ConflictError({
          message: strings.userExists,
          details: [strings.userExists],
          data: { email },
        });
      }

      if (username) {
        let foundUser = await User.findOne({ username });
        if (foundUser) {
          throw new ConflictError({
            message: strings.userExists,
            details: [strings.userExists],
            data: { email },
          });
        }
      } else {
        username = email.split('@')?.[0];
      }

      const newUser = new User({
        email,
        password,
        username,
        firstName,
        lastName,
        role,
      });

      const entity = await newUser.save();
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
   * Update user
   * @param {Object} args
   * @param {string=} args.firstName
   * @param {string=} args.lastName
   * @param {string=} args.password
   * @param {string=} args.isEmailVerified
   * @returns {Promise<User|null>}
   */
  const update = async (args) => {
    const operation = 'update';
    try {
      const _id = args?._id;
      const firstName = args?.firstName;
      const lastName = args?.lastName;
      const isEmailVerified = args?.isEmailVerified;
      let password = args?.password;

      const errors = [];
      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (!isNil(firstName) && !isString(firstName)) {
        errors.push(strings.firstNameValidation);
      }

      if (!isNil(isEmailVerified) && !isBoolean(isEmailVerified)) {
        errors.push(strings.emailVerifiedInputValidation);
      }

      if (!isNil(lastName) && !isString(lastName)) {
        errors.push(strings.lastNameValidation);
      }

      if (!isNil(password) && !isString(password) && isEmpty(password)) {
        errors.push(strings.passwordValidation);
      }

      if (password) {
        password = await hashService.hash(password, vars.saltRounds);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      const foundUser = await User.findOne({ _id });

      if (!foundUser) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: { _id },
        });
      }

      let data = merge(foundUser, {
        firstName,
        lastName,
        isEmailVerified,
        password,
      });

      const entity = await User.findOneAndUpdate({ _id }, data, { new: true }).exec();

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
   * Delete user
   * @param {Object} args
   * @param {string} args._id
   * @returns {Promise<User|null>}
   */
  const deleteById = (args = {}) => {
    const operation = 'deleteById';
    try {
      const _id = args?._id;

      const errors = [];

      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return User.findOneAndRemove({ _id }).exec();
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
    getAllAndCount,
    getById,
    getAll,
    findOne,
    create,
    update,
    deleteById,
  };
};

module.exports = userRepository;
