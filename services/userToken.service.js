const ms = require('ms');

const userTokenRepository = require('../repository/userToken.repository')();
const jwtService = require('../services/jwt.service')();
const errorService = require('../services/error.service')();

const userTokenService = () => {
  const name = 'userTokenService';

  /**
   * Get user token by token
   * @param {Object} args
   * @param {string} args.token
   * @returns {Promise<UserToken | null>}
   */
  const getByToken = async (token) => {
    const operation = 'getByToken';

    try {
      const result = await userTokenRepository.getByToken(token);
      return result;
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
   * Create
   * @param {Object} args
   * @param {string} args.payload
   * @param {Date} args.expiresIn
   * @param {string} args.secretKey
   * @param {string} args.user
   * @param {string} args.tokenType
   * @returns {Promise<UserToken | null>}
   */
  const create = async (args) => {
    const operation = 'create';

    try {
      const token = await jwtService.generateToken({
        payload: args.payload,
        expiresAt: args.expiresIn,
        secretKey: args.secretKey,
      });

      const userToken = await userTokenRepository.create({
        token,
        expiresIn: new Date(Date.now() + ms(args.expiresIn)),
        user: args.user,
        tokenType: args.tokenType,
      });

      return userToken;
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
   * @returns {Promise<UserToken | null>}
   */
  const deleteByToken = (args) => {
    const operation = 'deleteByToken';

    try {
      return userTokenRepository.deleteByToken(args);
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
   * Get user token by token
   * @param {Object} args
   * @param {string} args.user
   * @returns {Promise<UserToken | null>}
   */
  const deleteByUserId = (args) => {
    const operation = 'deleteByUserId';

    try {
      return userTokenRepository.deleteByUserId(args);
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
    getByToken,
    create,
    deleteByToken,
    deleteByUserId,
  };
};

module.exports = userTokenService;
