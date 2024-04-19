import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500));
  }
};

export const getOneContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);
    if (!contact) {
      next(HttpError(404));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      next(HttpError(404));
    }
    res.status(200).json(removedContact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const createContact = async (req, res) => {
  try {
    const newContact = req.body;
    const contact = await addContact(newContact);
    res.status(201).json(contact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contactData = req.body;
    const updatedContact = await updateContactById(contactId, contactData);
    if (!updatedContact) {
      next(HttpError(404));
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(HttpError(500));
  }
};
