import Joi from 'joi';
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phonePattern).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phonePattern),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ 'object.min': 'Body must have at least one field' });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const idSchema = Joi.string().length(24).hex();
