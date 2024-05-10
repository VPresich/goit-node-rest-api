import Contact from '../models/contact.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

export const getOneContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const removedContact = await Contact.findByIdAndDelete(id);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.status(200).json(removedContact);
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
});

export const updateContactFavoriteStatus = ctrlWrapper(
  async (req, res, next) => {
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.status(200).json(updatedContact);
  }
);

export const getContactsPerPage = ctrlWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  const results = {};

  results.totalRecords = await Contact.countDocuments().exec();
  results.totalPages = Math.ceil(results.totalRecords / limitNumber);

  if (pageNumber > results.totalPages) {
    throw HttpError(404, 'Page not found');
  }

  results.page = pageNumber;
  results.limit = limitNumber;
  results.results = await Contact.find()
    .limit(limitNumber)
    .skip(startIndex)
    .exec();

  res.status(200).json(results);
});
