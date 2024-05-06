import express from 'express';
import contactsRouter from './contactsRouter.js';

const routers = express.Router();
routers.use('/contacts', contactsRouter);

export default routers;
