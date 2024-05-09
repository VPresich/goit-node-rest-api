import express from 'express';
import validateBody from '../helpers/validateBody.js';
import authMiddleware from '../helpers/authMiddleware.js';

import { registerSchema, loginSchema } from '../schemas/usersSchemas.js';

import {
  register,
  login,
  logout,
  getCurrent,
} from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);

authRouter.post('/login', validateBody(loginSchema), login);

authRouter.post('/logout', authMiddleware, logout);

authRouter.get('/current', authMiddleware, getCurrent);

export default authRouter;
