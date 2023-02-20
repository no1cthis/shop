"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../services/validator");
const productType_mongo_1 = __importDefault(require("./productType.mongo"));
async function getAllProductType() {
    return await productType_mongo_1.default.find({}, { __v: 0 }).sort({ name: -1 });
}
async function addNewProductType(productType) {
    const { error, value } = validator_1.validator.validateProductType(productType);
    if (error)
        return { message: error.message, __typename: "Error" };
    productType = {
        name: productType.name.toLowerCase().trim(),
        __typename: "ProductType",
    };
    await productType_mongo_1.default.findOneAndUpdate({
        name: productType.name,
    }, productType, { upsert: true });
    return productType;
}
async function deleteProductType(name) {
    return (await productType_mongo_1.default.deleteOne({ name })).deletedCount > 0;
}
exports.default = { getAllProductType, addNewProductType, deleteProductType };
//# sourceMappingURL=productType.model.js.map