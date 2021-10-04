const vars = require('../config/vars');
const strings = require('../config/strings');
const { AppError } = require('../utils/ApiError');
const authService = require('../services/auth.service')();
const logger = require('../utils/winstonLogger')('userTokenController');

const userTokenController = () => {
  const name = 'userTokenController';

  const renewAccessToken = async (req, res, next) => {
    const cookie = req.cookies || {};
    const refreshToken = cookie[vars.refreshTokenCookieName];
    let newAccessToken = '';
    if (refreshToken) {
      try {
        const tokenResult = await authService.renewAccessToken(refreshToken);
        return res.status(200).send({
          message: 'Token refresh successful',
          data: {
            accessToken: tokenResult.token,
            _id: tokenResult._id,
            role: tokenResult.role,
          },
        });
      } catch (err) {
        logger.info({ message: 'Error renewing access token', operation: 'renewAccessToken', data: err });
        next(err);
      }
    } else {
      logger.info({ message: 'Refresh token not provided', operation: 'renewAccessToken' });
      return res.status(400).send({ message: 'Invalid Token' });
    }
  };

  return {
    renewAccessToken,
  };
};

module.exports = userTokenController;
