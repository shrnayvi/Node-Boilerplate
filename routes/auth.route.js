const { Router } = require('express');

const authController = require('../controllers/auth.controller')();
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.get('/me', authenticate, authController.getLoggedInUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-email-verification', authController.resendEmailVerification);
router.post('/logout', authController.logout);

module.exports = router;
