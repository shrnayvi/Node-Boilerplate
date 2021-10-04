const vars = require('../config/vars');
const strings = require('../config/strings');
const { NotAuthenticatedError } = require('../utils/ApiError');

const jwtService = require('../services/jwt.service')();

/**
 * Checks token and handles authentication
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next Next function
 */
module.exports = async (req, res, next) => {
  try {
    let token = await jwtService.extractToken(req.headers);
    try {
      let decoded = await jwtService.verifyToken({
        token,
        secretKey: vars.secretKey,
      });
      req.user = decoded;
      next();
    } catch (err) {
      throw new NotAuthenticatedError({
        message: strings.userNotAuthenticated,
        details: [strings.userNotAuthenticated],
      });
    }
  } catch (err) {
    next(err);
  }
};
