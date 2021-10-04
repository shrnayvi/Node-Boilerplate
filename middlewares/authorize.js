const { ForbiddenError } = require('../utils/ApiError');
const strings = require('../config/strings');

const logger = require('../utils/winstonLogger')('authorize');

/**
 * ACL
 * @param {Array|string} roles User roles to access resource
 */
module.exports = (roles) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  /**
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next Next function
   */
  return (req, res, next) => {
    if (roles.length && roles.includes(req.user.role)) {
      next();
    } else {
      const error = new ForbiddenError({
        message: strings.forbidden,
        details: [strings.userNotAuthorized],
      });
      next(error);
    }
  };
};
