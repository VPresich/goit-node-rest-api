import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import path from 'node:path';
import fs from 'node:fs/promises';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

const avatarsDir = path.resolve('public', 'avatars');

export const register = ctrlWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const user = await User.findOne({ email: emailInLowerCase });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    email: emailInLowerCase,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
});

export const login = ctrlWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const user = await User.findOne({ email: emailInLowerCase });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
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

export const getCurrent = ctrlWrapper(async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).end();
});

export const updateSubscription = ctrlWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );
  if (!updatedUser) {
    throw HttpError(404);
  }
  res
    .status(200)
    .json({ email: updatedUser.email, subscription: updatedUser.subscription });
});

export const updateAvatar = ctrlWrapper(async (req, res, next) => {
  const { id } = req.user;

  const { path: tempUpload, originalname } = req.file;
  const fileName = `${id}${originalname}`;
  const resultUpload = path.resolve(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);

  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250);
  await image.writeAsync(resultUpload);

  const avatarURL = path.resolve('avatars', fileName);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { avatarURL },
    { new: true }
  );
  if (!updatedUser) {
    throw HttpError(404);
  }
  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});

export default updateAvatar;
