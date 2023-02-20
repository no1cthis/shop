"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDisconnect = exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose_1.default.connection.once("open", () => {
    console.log("MongoDB connection ready!");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error(err);
});
async function mongoConnect() {
    if (MONGO_URL)
        mongoose_1.default.connect(MONGO_URL);
    else
        console.log("Connection to mongo denied");
}
exports.mongoConnect = mongoConnect;
async function mongoDisconnect() {
    mongoose_1.default.disconnect();
}
exports.mongoDisconnect = mongoDisconnect;
//# sourceMappingURL=mongo.js.map