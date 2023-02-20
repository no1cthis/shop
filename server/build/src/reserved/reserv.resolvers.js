"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reserv_model_1 = __importDefault(require("./reserv.model"));
module.exports = {
    Query: {
        reservs: (_, filter) => {
            return reserv_model_1.default.getAllReservs(filter);
        },
    },
    Mutation: {
        cancelReserv: (_, { id }) => {
            return reserv_model_1.default.cancelReserv({ id });
        },
        cancelAllOlderThanReserv: (_, { olderThan }) => {
            return reserv_model_1.default.cancelAllOlderThanReserv(olderThan);
        },
    },
};
//# sourceMappingURL=reserv.resolvers.js.map