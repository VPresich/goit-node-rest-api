import Joi from 'joi';
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phonePattern).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phonePattern),
})
  .min(1)
  .error(new Error('Body must have at least one field'));
