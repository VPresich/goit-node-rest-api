import express from 'express';
import validateBody from '../helpers/validateBody.js';
import authMiddleware from '../helpers/authMiddleware.js';
import upload from '../helpers/uploadMiddleware.js';

import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from '../schemas/usersSchemas.js';

import { register, login, logout } from '../controllers/authControllers.js';

import {
  getCurrent,
  updateSubscription,
  updateAvatar,
} from '../controllers/usersControllers.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);

authRouter.post('/login', validateBody(loginSchema), login);

authRouter.post('/logout', authMiddleware, logout);

authRouter.get('/current', authMiddleware, getCurrent);

authRouter.patch(
  '/',
  validateBody(subscriptionSchema),
  authMiddleware,
  updateSubscription
);

authRouter.patch(
  '/avatars',
  authMiddleware,
  upload.single('avatar'),
  updateAvatar
);

export default authRouter;
