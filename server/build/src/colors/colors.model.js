"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../services/validator");
const colors_mongo_1 = __importDefault(require("./colors.mongo"));
const products_mongo_1 = __importDefault(require("../products/products.mongo"));
async function getAllColors(name) {
    console.log(name);
    return await colors_mongo_1.default
        .find(name ? { name } : {}, { __v: 0 })
        .sort({ name: 1 });
}
async function addNewColor(color) {
    const { error, value } = validator_1.validator.validateColor(color);
    if (error)
        return { message: error.message, __typename: "Error" };
    color = {
        ...color,
        name: color.name.toLowerCase().trim(),
        __typename: "ColorChoose",
    };
    await colors_mongo_1.default.findOneAndUpdate({
        name: color.name,
    }, color, { upsert: true });
    return color;
}
async function deleteColor(name) {
    return (await colors_mongo_1.default.deleteMany({ name })).deletedCount > 0;
}
async function getColorsByType(type) {
    const result = [];
    const names = await products_mongo_1.default
        .find(type === "all" ? {} : { type })
        .distinct("color.name");
    for (let i = 0; i < names.length; i++)
        result.push(await colors_mongo_1.default.findOne({ name: names[i] }, { name: 1, code: 1 }));
    return result;
}
exports.default = { getAllColors, addNewColor, deleteColor, getColorsByType };
//# sourceMappingURL=colors.model.js.map