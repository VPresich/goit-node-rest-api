import express from 'express';
import contactsRouter from './contactsRouter.js';
import authRouter from './authRouter.js';

const routers = express.Router();

routers.use('/contacts', contactsRouter);
routers.use('/auth', authRouter);

export default routers;
