import { Router } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import TokenController from '../controllers/TokenController';

const tokenController: TokenController = container.get<TokenController>(TYPES.UserTokenController);
const router = Router();

router.post('/refresh', tokenController.renewAccessToken);

export default router;
