import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from './HttpError.js';

const authMiddleware = async (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(HttpError(401));
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401));
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return next(HttpError(401));
    }
    try {
      const user = await User.findById(decode.id);
      if (!user || user.token !== token) {
        throw HttpError(401);
      }
      if (!user._id || !user.email || !user.subscription) {
        throw HttpError(401);
      }
      req.user = {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default authMiddleware;
