import Jimp from 'jimp';
import path from 'node:path';
import fs from 'node:fs/promises';

import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { uploadFileToGCS } from '../helpers/upload.js';

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

// export const updateAvatar = ctrlWrapper(async (req, res, next) => {
//   const { id, avatarURL: oldAvatarURL } = req.user;
//   const { path: tempUpload, originalname } = req.file;

//   const avatarsDir = path.resolve('public', 'avatars');

//   // Create unique avatars name for the user
//   const avatarName = `${id}avatar${path.extname(originalname)}`;

//   // Avatars name with full path
//   const resultUpload = path.resolve(avatarsDir, avatarName);

//   // Change size of the user file
//   await resizeImage(tempUpload, 250, 250);

//   // Delete old avatar from dir
//   await deleteAvatar(oldAvatarURL);

//   // Move tempUpload to the avatars dir
//   await fs.rename(tempUpload, resultUpload);

//   // Change field in DB
//   const avatarURL = path.join('avatars', avatarName);
//   const updatedUser = await User.findByIdAndUpdate(
//     id,
//     { avatarURL },
//     { new: true }
//   );
//   if (!updatedUser) {
//     throw HttpError(401);
//   }
//   res.status(200).json({
//     avatarURL,
//   });
// });

export const updateAvatar = ctrlWrapper(async (req, res, next) => {
  const { id, avatarURL: oldAvatarURL } = req.user;
  const { path: tempUpload, originalname } = req.file;

  // Create unique avatars name for the user
  const gcsFileName = `${id}avatar${path.extname(originalname)}`;

  // Avatars name with full path
  const gcsPath = 'avatars/' + gcsFileName;

  // Change size of the user file
  await resizeImage(tempUpload, 250, 250);

  // upload to ToGCS
  let avatarURL = await uploadFileToGCS(tempUpload, gcsPath);
  avatarURL = `https://storage.cloud.google.com/${process.env.GOOGLE_BUCKET_NAME}/${gcsPath}`;
  await deleteAvatar(tempUpload);

  // Change field in DB
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { avatarURL },
    { new: true }
  );
  if (!updatedUser) {
    throw HttpError(401);
  }
  res.status(200).json({
    avatarURL,
  });
});

// export const getAvatar = ctrlWrapper(async (req, res, next) => {
//   const { id, avatarURL } = req.user;

//   const user = await User.findById(id);
//   if (!user) {
//     throw HttpError(401);
//   }
//   if (!user.avatarURL) {
//     throw HttpError(404, 'Avatar not found');
//   }

//   if (avatarURL.includes('gravatar')) {
//     return res.redirect(avatarURL);
//   }

//   const avatarDir = path.resolve('public', avatarURL);
//   res.status(200).sendFile(avatarDir);
// });

export const getAvatar = ctrlWrapper(async (req, res, next) => {
  const { id, avatarURL } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401);
  }
  if (!user.avatarURL) {
    throw HttpError(404, 'Avatar not found');
  }
  res.status(200).json({ avatarURL });
});

// Auxiliary functions

async function deleteAvatar(oldAvatarURL) {
  if (oldAvatarURL && !oldAvatarURL.includes('gravatar')) {
    const oldAvatarFullName = path.resolve('public', oldAvatarURL);

    try {
      await fs.access(oldAvatarFullName);
      await fs.unlink(oldAvatarFullName);
    } catch (error) {}
  }
}

async function resizeImage(imagePath, width, height) {
  const image = await Jimp.read(imagePath);
  await image.resize(width, height);
  await image.writeAsync(imagePath);
}
