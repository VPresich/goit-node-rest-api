import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

// Decorator for centralized error handling across all controllers
const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

export const getOneContact = ctrlWrapper(async (req, res, next) => {
  const contactId = req.params.id;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  const contactId = req.params.id;
  const removedContact = await removeContact(contactId);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.status(200).json(removedContact);
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const newContact = req.body;
  const contact = await addContact(newContact);
  res.status(201).json(contact);
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const contactId = req.params.id;
  const contactData = req.body;
  const updatedContact = await updateContactById(contactId, contactData);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
});
