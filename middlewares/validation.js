const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of "Name" field is 2',
      "string.max": 'The maximum length of "Name" field is 30',
      "string.empty": '"Name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": '"URL" field must be filled in',
      "string.uri": '"URL" field must be a valid url',
    }),
    weather: Joi.string()
      .valid("hot", "warm", "cold")
      .required()
      .messages({ "string.empty": '"Weather" field must be filled in' }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of "Name" field is 2',
      "string.max": 'The maximum length of "Name" field is 30',
      "string.empty": '"Name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).message({
      "string.empty": '"Avatar" field must be filled in',
      "string.uri": '"Avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().message({
      "string.email": '"Email" field must be email format',
    }),
    password: Joi.string().required(),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message({
      "string.email": '"Email" field must be email format',
    }),
    password: Joi.string().required(),
  }),
});

const validateUserAndItemID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of "Name" field is 2',
      "string.max": 'The maximum length of "Name" field is 30',
      "string.empty": '"Name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).message({
      "string.empty": '"Avatar" field must be filled in',
      "string.uri": '"Avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateLoginUser,
  validateUserAndItemID,
  validateUserUpdate,
};
