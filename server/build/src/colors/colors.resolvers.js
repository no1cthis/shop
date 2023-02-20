"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_model_1 = __importDefault(require("./colors.model"));
module.exports = {
    Query: {
        colors: (_, { name }) => {
            return colors_model_1.default.getAllColors(name);
        },
        colorsByType: (_, { type }) => {
            return colors_model_1.default.getColorsByType(type);
        },
    },
    Mutation: {
        addNewColor: (_, { name, code }) => {
            return colors_model_1.default.addNewColor({
                name,
                code,
            });
        },
        deleteColor: (_, { name }) => {
            return colors_model_1.default.deleteColor(name);
        },
    },
};
//# sourceMappingURL=colors.resolvers.js.map