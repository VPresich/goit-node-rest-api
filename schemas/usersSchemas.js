import Joi from 'joi';
import { EMAIL_PATTERN } from '../helpers/constants.js';

export const registerSchema = Joi.object({
  email: Joi.string().required().pattern(EMAIL_PATTERN),
  password: Joi.string().required().min(6),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().pattern(EMAIL_PATTERN),
  password: Joi.string().required().min(6),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.required().valid('starter', 'pro', 'business'),
});
