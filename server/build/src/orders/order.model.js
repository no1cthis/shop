"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_mongo_1 = __importDefault(require("./order.mongo"));
async function addNewOrder(order) {
    await order_mongo_1.default.findOneAndUpdate({
        id: order.id,
    }, order, { upsert: true });
    return order;
}
async function getAllOrders({ sortBy = "created", sort = -1, customerName, recieverName, email, phone, }) {
    const filter = {};
    if (customerName) {
        const pattern = customerName.trim().toLowerCase();
        filter["customer.name"] = new RegExp(pattern);
    }
    if (recieverName) {
        const pattern = recieverName.trim().toLowerCase();
        filter["reciever.name"] = new RegExp(pattern);
    }
    if (email) {
        const pattern = email.trim();
        filter["customer.email"] = new RegExp(pattern);
    }
    if (phone) {
        const pattern = phone.trim();
        filter["customer.phone"] = new RegExp(pattern);
    }
    const sortObj = { [sortBy]: sort };
    if (sortBy === "status")
        sortObj.created = sort;
    const result = await order_mongo_1.default.find(filter, { __v: 0 }).sort(sortObj);
    return result;
}
exports.default = { addNewOrder, getAllOrders };
//# sourceMappingURL=order.model.js.map