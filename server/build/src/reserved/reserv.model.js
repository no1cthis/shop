"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_model_1 = __importDefault(require("../products/products.model"));
const reserv_mongo_1 = __importDefault(require("./reserv.mongo"));
async function addNewReserv(reserved) {
    for (let i = 0; i < reserved.products.length; i++) {
        const { title, color: colorName, quantity, size } = reserved.products[i];
        await products_model_1.default.reservProduct({ title, colorName, size, quantity });
    }
    await reserv_mongo_1.default.findOneAndUpdate({
        id: reserved.id,
    }, reserved, { upsert: true });
    return reserved;
}
async function cancelReserv({ id, notReturnToStock, }) {
    const reserv = await reserv_mongo_1.default.findOne({ id });
    for (let i = 0; i < reserv.products.length; i++) {
        const { title, color: colorName, quantity, size } = reserv.products[i];
        await products_model_1.default.reservProduct({
            title,
            colorName,
            size,
            quantity: notReturnToStock ? 0 : -1 * quantity,
        });
    }
    await reserv_mongo_1.default.findOneAndDelete({
        id,
    });
    return true;
}
async function cancelAllOlderThanReserv(olderThan) {
    await reserv_mongo_1.default.deleteMany({
        created: { $lt: olderThan },
    });
    return true;
}
async function getAllReservs({ sort = -1 }) {
    const result = await reserv_mongo_1.default
        .find({}, { __v: 0 })
        .sort({ created: sort });
    return result;
}
exports.default = {
    addNewReserv,
    cancelReserv,
    getAllReservs,
    cancelAllOlderThanReserv,
};
//# sourceMappingURL=reserv.model.js.map