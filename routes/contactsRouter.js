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

contactsRouter.get('/:id', validateId(idSchema), authMiddleware, getOneContact);

contactsRouter.delete(
  '/:id',
  validateId(idSchema),
  authMiddleware,
  deleteContact
);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  authMiddleware,
  createContact
);

contactsRouter.put(
  '/:id',
  validateId(idSchema),
  validateBody(updateContactSchema),
  authMiddleware,
  updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  validateId(idSchema),
  validateBody(updateFavoriteSchema),
  authMiddleware,
  updateContactFavoriteStatus
);

export default contactsRouter;
