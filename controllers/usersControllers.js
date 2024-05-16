import Jimp from 'jimp';
import path from 'node:path';
import fs from 'node:fs/promises';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

export const getCurrent = ctrlWrapper(async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
});

export const updateSubscription = ctrlWrapper(async (req, res, next) => {
  const { id, avatarURL: oldUrl } = req.user;
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

  const avatarsDir = path.resolve('public', 'avatars');

  // Create unique avatars name for the user
  const avatarName = `${id}avatar${path.extname(originalname)}`;

  // Avatars name with full path
  const resultUpload = path.resolve(avatarsDir, avatarName);

  // Change size of user file
  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);

  // Move to the avatars dir
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.resolve('avatars', avatarName);
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
