import Contact from '../models/contact.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const contacts = await Contact.find({ owner: userId }).populate(
    'owner',
    '_id name email subscription'
  );
  res.status(200).json(contacts);
});

export const getOneContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const contact = await Contact.findById(id).populate(
    'owner',
    '_id name email subscription'
  );
  if (!contact) {
    throw HttpError(404);
  }
  if (!userId.equals(contact.owner._id)) {
    throw HttpError(403, 'You are not authorized to access this contact');
  }
  res.status(200).json(contact);
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const removedContact = await Contact.findByIdAndDelete(id);
  if (!removedContact) {
    throw HttpError(404);
  }
  if (!userId.equals(removedContact.owner)) {
    throw HttpError(403, 'You are not authorized to remove this contact');
  }
  res.status(200).json(removedContact);
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.user;
  const contact = await Contact.create({
    ...req.body,
    owner: id,
  });
  res.status(201).json(contact);
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
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
    const { id: userId } = req.user;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedContact) {
      throw HttpError(404);
    }
    if (!userId.equals(updatedContact.owner)) {
      throw HttpError(403, 'You are not authorized to update this contact');
    }
    res.status(200).json(updatedContact);
  }
);

export const getContacts = ctrlWrapper(async (req, res, next) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const { id: userId } = req.user;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const startIndex = (pageNumber - 1) * limitNumber;

  const query = {};

  Object.keys(filters).forEach(key => {
    if (filters[key] === 'true' || filters[key] === 'false') {
      query[key] = filters[key] === 'true';
    } else {
      query[key] = filters[key];
    }
  });

  const result = {};

  result.totalRecords = await Contact.countDocuments({
    ...query,
    owner: userId,
  }).exec();
  result.totalPages = Math.ceil(result.totalRecords / limitNumber);

  if (pageNumber > result.totalPages) {
    throw HttpError(404, 'Page not found');
  }

  result.page = pageNumber;
  result.limit = limitNumber;

  result.contacts = await Contact.find({ ...query, owner: userId })
    .populate('owner', '_id name email subscription')
    .limit(limitNumber)
    .skip(startIndex)
    .exec();

  res.status(200).json(result);
});
