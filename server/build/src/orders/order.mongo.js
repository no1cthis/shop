"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
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
    customer: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    reciever: {
        address: {
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            line1: {
                type: String,
                required: true,
            },
            line2: {
                type: String,
                required: true,
            },
            postal_code: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
        },
        name: {
            type: String,
            required: true,
        },
    },
});
exports.default = mongoose_1.default.model("Orders", orderSchema);
//# sourceMappingURL=order.mongo.js.map