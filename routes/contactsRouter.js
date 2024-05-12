import express from 'express';
import validateBody from '../helpers/validateBody.js';
import validateId from '../helpers/validateId.js';

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
  idSchema,
} from '../schemas/contactsSchemas.js';

import {
  createContact,
  getAllContacts,
  getOneContact,
  deleteContact,
  updateContact,
  updateContactFavoriteStatus,
  getContacts,
} from '../controllers/contactsControllers.js';

import authMiddleware from '../helpers/authMiddleware.js';

const contactsRouter = express.Router();

// contactsRouter.get('/', authMiddleware, getAllContacts);
contactsRouter.get('/', authMiddleware, getContacts);

contactsRouter.get('/:id', authMiddleware, validateId(idSchema), getOneContact);

contactsRouter.delete(
  '/:id',
  authMiddleware,
  validateId(idSchema),
  deleteContact
);

contactsRouter.post(
  '/',
  authMiddleware,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  '/:id',
  authMiddleware,
  validateId(idSchema),
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  authMiddleware,
  validateId(idSchema),
  validateBody(updateFavoriteSchema),
  updateContactFavoriteStatus
);

export default contactsRouter;
