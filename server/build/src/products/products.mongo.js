"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productsSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    buyCount: {
        type: Number,
        required: true,
    },
    allSizes: {
        type: [Number],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    color: [
        {
            name: {
                type: String,
                required: true,
            },
            photos: {
                type: [String],
                required: true,
            },
            sizesAvailable: {
                _36: {
                    type: Number,
                    required: true,
                },
                _37: {
                    type: Number,
                    required: true,
                },
                _38: {
                    type: Number,
                    required: true,
                },
                _39: {
                    type: Number,
                    required: true,
                },
                _40: {
                    type: Number,
                    required: true,
                },
                _41: {
                    type: Number,
                    required: true,
                },
                _42: {
                    type: Number,
                    required: true,
                },
                _43: {
                    type: Number,
                    required: true,
                },
                _44: {
                    type: Number,
                    required: true,
                },
                _45: {
                    type: Number,
                    required: true,
                },
                _46: {
                    type: Number,
                    required: true,
                },
                _47: {
                    type: Number,
                    required: true,
                },
                type: Object,
                required: true,
            },
        },
    ],
});
exports.default = mongoose_1.default.model("Products", productsSchema);
//# sourceMappingURL=products.mongo.js.map