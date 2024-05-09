import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

export const register = ctrlWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const user = await User.findOne({ email: emailInLowerCase });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: emailInLowerCase,
    password: hashPassword,
  });
  res.status(201).json({
    user: {
      email,
      subscription: newUser.subscription,
    },
  });
});

export const login = ctrlWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();
  console.log(emailInLowerCase);
  const user = await User.findOne({ email: emailInLowerCase });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).end();
});
