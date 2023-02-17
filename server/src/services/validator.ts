import Joi, { number } from "joi";

const validatorFunction = (schema: Joi.ObjectSchema) => (payload) =>
  schema.validate(payload);

const colorSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string()
    .required()
    .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/),
  // .message("Color code is incorrect"),
});
const productSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "string.required": `Title is required ` }),
  description: Joi.string()
    .required()
    .messages({ "string.required": `Description is required ` }),
  type: Joi.string()
    .required()
    .messages({ "string.required": `Type is required ` }),
  price: Joi.number()
    .precision(2)
    .required()
    .messages({ "price.required": `Price is required ` }),
  allSizes: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required()
    .messages({ "array.min": "Choose sizes" }),
  color: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        photos: Joi.array()
          .items(Joi.string())
          .min(1)
          .message("Upload photo")
          .required(),
        sizesAvailable: Joi.object({
          _36: Joi.number().integer(),
          _37: Joi.number().integer(),
          _38: Joi.number().integer(),
          _39: Joi.number().integer(),
          _40: Joi.number().integer(),
          _41: Joi.number().integer(),
          _42: Joi.number().integer(),
          _43: Joi.number().integer(),
          _44: Joi.number().integer(),
          _45: Joi.number().integer(),
          _46: Joi.number().integer(),
          _47: Joi.number().integer(),
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Choose colors",
    }),
  url: Joi.string(),
});

const productTypeSchema = Joi.object({
  name: Joi.string().required(),
});

export const validator = {
  validateColor: validatorFunction(colorSchema),
  validateProduct: validatorFunction(productSchema),
  validateProductType: validatorFunction(productTypeSchema),
};
