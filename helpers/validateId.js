import HttpError from './HttpError.js';
const validateId = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.params.id);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateId;
