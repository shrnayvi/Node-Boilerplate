const jwt = require('jsonwebtoken');

const { NotAuthenticatedError } = require('../utils/ApiError');

const jwtService = () => {
  const name = 'jwtService';

  /**
   * Generate jwt token
   * @param {Object} args
   * @param {any} args.payload
   * @param {string} args.secretKey
   * @param {Date} args.expiresAt
   */
  const generateToken = (args = {}) => {
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
            resolve(token);
          }
        }
      );
    });
  };

  /**
   * Verify jwt token
   * @param {Object} args
   * @param {string} args.token
   * @param {string} args.secretKey
   */
  const verifyToken = (args) => {
    return new Promise((resolve, reject) => {
      jwt.verify(args.token, args.secretKey, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded);
      });
    });
  };

  /**
   * Extract token
   * @param {Object} args
   * @param {string} args.authorization
   */
  const extractToken = (args = {}) => {
    try {
      let bearerToken = args?.authorization ?? '';

      if (!bearerToken) {
        return null;
      }

      const [_, token] = bearerToken.split(' ');
      return token;
    } catch (err) {
      return null;
    }
  };

  return {
    generateToken,
    verifyToken,
    extractToken,
  };
};

module.exports = jwtService;
