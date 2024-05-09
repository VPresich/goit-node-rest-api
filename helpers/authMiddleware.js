import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from './HttpError.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'undefined') {
    next(HttpError(401));
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401));
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      next(HttpError(401));
    }
    try {
      const user = await User.findById(decode.id);
      if (!user || user.token !== token) {
        next(HttpError(401));
      }
      req.user = {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default authMiddleware;
