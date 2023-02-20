"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservedSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: true,
    },
    products: [
        {
            title: {
                type: String,
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
            photo: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});
exports.default = mongoose_1.default.model("Reservs", reservedSchema);
//# sourceMappingURL=reserv.mongo.js.map