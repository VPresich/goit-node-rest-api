import Jimp from 'jimp';
import path from 'node:path';
import fs from 'node:fs/promises';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

const avatarsDir = path.resolve('public', 'avatars');

export const getCurrent = ctrlWrapper(async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
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
  const fileName = `${id}avatar${path.extname(originalname)}`;
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
