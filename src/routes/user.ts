import { Router } from 'express';

import config from '../config';
import { TYPES } from '../types';
import container from '../inversify.config';
import UserController from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const userController: UserController = container.get<UserController>(TYPES.UserController);
const router = Router();
const { roles } = config;

router.get('/:_id', authenticate, userController.getUser);
router.get('/', authenticate, authorize(roles.admin), userController.getUsers);
router.post('/', authenticate, authorize(roles.admin), userController.createUser);
router.put('/change-password/:_id', authenticate, userController.changePassword);
router.put('/:_id', authenticate, userController.updateUser);
router.delete('/:_id', authenticate, authorize(roles.admin), userController.deleteUser);

export default router;
