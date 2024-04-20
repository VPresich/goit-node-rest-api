import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

// export const getAllContacts = async (_, res, next) => {
//   try {
//     const contacts = await listContacts();
//     res.status(200).json(contacts);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOneContact = async (req, res, next) => {
//   try {
//     const contactId = req.params.id;
//     const contact = await getContactById(contactId);
//     if (!contact) {
//       throw HttpError(404);
//     }
//     res.status(200).json(contact);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteContact = async (req, res, next) => {
//   try {
//     const contactId = req.params.id;
//     const removedContact = await removeContact(contactId);
//     if (!removedContact) {
//       throw HttpError(404);
//     }
//     res.status(200).json(removedContact);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createContact = async (req, res, next) => {
//   try {
//     const newContact = req.body;
//     const contact = await addContact(newContact);
//     res.status(201).json(contact);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateContact = async (req, res, next) => {
//   try {
//     const contactId = req.params.id;
//     const contactData = req.body;
//     const updatedContact = await updateContactById(contactId, contactData);
//     if (!updatedContact) {
//       throw HttpError(404);
//     }
//     res.status(200).json(updatedContact);
//   } catch (error) {
//     next(error);
//   }
// };

//Decorator for centralized error handling across all controllers
const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getAllContactsCtrl = async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

const getOneContactCtrl = async (req, res, next) => {
  const contactId = req.params.id;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
};

const deleteContactCtrl = async (req, res, next) => {
  const contactId = req.params.id;
  const removedContact = await removeContact(contactId);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.status(200).json(removedContact);
};

const createContactCtrl = async (req, res, next) => {
  const newContact = req.body;
  const contact = await addContact(newContact);
  res.status(201).json(contact);
};

const updateContactCtrl = async (req, res, next) => {
  const contactId = req.params.id;
  const contactData = req.body;
  const updatedContact = await updateContactById(contactId, contactData);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
};

export const getAllContacts = ctrlWrapper(getAllContactsCtrl);
export const getOneContact = ctrlWrapper(getOneContactCtrl);
export const deleteContact = ctrlWrapper(deleteContactCtrl);
export const createContact = ctrlWrapper(createContactCtrl);
export const updateContact = ctrlWrapper(updateContactCtrl);
