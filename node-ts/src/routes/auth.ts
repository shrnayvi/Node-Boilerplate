import { Router } from 'express';

import container from '../inversify.config';
import { TYPES } from '../types';
import AuthController from '../controllers/AuthController';

const router = Router();

const appController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', appController.signUp);
router.post('/login', appController.login);
router.post('/verify-email', appController.verifyEmail);
router.post('/forgot-password', appController.forgotPassword);
router.post('/reset-password', appController.resetPassword);
router.post('/resend-email-verification', appController.resendEmailVerification);
router.post('/renew-access-token', appController.renewAccessToken);
router.post('/logout', appController.logout);

export default router;
