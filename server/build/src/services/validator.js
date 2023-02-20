"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const joi_1 = __importDefault(require("joi"));
const validatorFunction = (schema) => (payload) => schema.validate(payload);
const colorSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    code: joi_1.default.string()
        .required()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/),
});
const productSchema = joi_1.default.object({
    title: joi_1.default.string()
        .required()
        .messages({ "string.required": `Title is required ` }),
    description: joi_1.default.string()
        .required()
        .messages({ "string.required": `Description is required ` }),
    type: joi_1.default.string()
        .required()
        .messages({ "string.required": `Type is required ` }),
    price: joi_1.default.number()
        .precision(2)
        .required()
        .messages({ "price.required": `Price is required ` }),
    allSizes: joi_1.default.array()
        .items(joi_1.default.number().integer())
        .min(1)
        .required()
        .messages({ "array.min": "Choose sizes" }),
    color: joi_1.default.array()
        .items(joi_1.default.object({
        name: joi_1.default.string().required(),
        photos: joi_1.default.array()
            .items(joi_1.default.string())
            .min(1)
            .message("Upload photo")
            .required(),
        sizesAvailable: joi_1.default.object({
            _36: joi_1.default.number().integer(),
            _37: joi_1.default.number().integer(),
            _38: joi_1.default.number().integer(),
            _39: joi_1.default.number().integer(),
            _40: joi_1.default.number().integer(),
            _41: joi_1.default.number().integer(),
            _42: joi_1.default.number().integer(),
            _43: joi_1.default.number().integer(),
            _44: joi_1.default.number().integer(),
            _45: joi_1.default.number().integer(),
            _46: joi_1.default.number().integer(),
            _47: joi_1.default.number().integer(),
        }),
    }))
        .min(1)
        .required()
        .messages({
        "array.min": "Choose colors",
    }),
    url: joi_1.default.string(),
});
const productTypeSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
exports.validator = {
    validateColor: validatorFunction(colorSchema),
    validateProduct: validatorFunction(productSchema),
    validateProductType: validatorFunction(productTypeSchema),
};
//# sourceMappingURL=validator.js.map