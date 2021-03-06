import { Router } from 'express';

import container from '../inversify.config';
import { TYPES } from '../types';
import UserController from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import config from '../config';

const { roles } = config;

const router = Router();

const userController = container.get<UserController>(TYPES.UserController);

router.get('/', authenticate, authorize(roles.admin), userController.getUsers);
router.get('/:_id', authenticate, authorize(roles.user, roles.admin), userController.getSingleUser);
router.put('/:_id', authenticate, authorize(roles.user, roles.admin), userController.updateUser);
router.delete('/:_id', authenticate, authorize(roles.admin), userController.deleteUser);

export default router;
