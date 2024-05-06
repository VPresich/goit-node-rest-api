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
} from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', validateId(idSchema), getOneContact);

contactsRouter.delete('/:id', validateId(idSchema), deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put(
  '/:id',
  validateId(idSchema),
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  validateId(idSchema),
  validateBody(updateFavoriteSchema),
  updateContactFavoriteStatus
);

export default contactsRouter;
