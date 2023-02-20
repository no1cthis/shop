"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = __importDefault(require("./order.model"));
module.exports = {
    Query: {
        orders: (_, filter) => {
            return order_model_1.default.getAllOrders(filter);
        },
    },
    Mutation: {
        editOrder: (_, { order }) => {
            return order_model_1.default.addNewOrder(order);
        },
    },
};
//# sourceMappingURL=order.resolvers.js.map