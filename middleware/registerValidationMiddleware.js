import Joi from "joi";
import HTTP_STATUS from "../helpers/httpStatus.js";

export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  next();
};
