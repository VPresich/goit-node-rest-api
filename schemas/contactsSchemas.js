import Joi from 'joi';
import { PHONE_PATTERN, EMAIL_PATTERN } from '../helpers/constants.js';

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().pattern(EMAIL_PATTERN),
  phone: Joi.string().required().pattern(PHONE_PATTERN),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(EMAIL_PATTERN),
  phone: Joi.string().pattern(PHONE_PATTERN),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ 'object.min': 'Body must have at least one field' });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const idSchema = Joi.string().length(24).hex();
