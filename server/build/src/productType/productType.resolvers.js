"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productType_model_1 = __importDefault(require("./productType.model"));
module.exports = {
    Query: {
        allProductTypes: () => {
            return productType_model_1.default.getAllProductType();
        },
    },
    Mutation: {
        addNewProductType: (_, { name }) => {
            return productType_model_1.default.addNewProductType({
                name,
            });
        },
        deleteProductType: (_, { name }) => {
            return productType_model_1.default.deleteProductType(name);
        },
    },
};
//# sourceMappingURL=productType.resolvers.js.map