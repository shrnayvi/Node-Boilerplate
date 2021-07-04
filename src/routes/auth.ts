import { Router } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import AuthController from '../controllers/AuthController';
import authenticate from '../middlewares/authenticate';

const authController: AuthController = container.get<AuthController>(TYPES.AuthController);
const router = Router();

router.get('/me', authenticate, authController.getLoggedInUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-email-verification', authController.resendEmailVerification);
router.post('/logout', authController.logout);

export default router;
