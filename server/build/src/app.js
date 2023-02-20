"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const stripe_1 = __importDefault(require("./stripe/stripe"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        process.env.FRONTEND_URL,
        process.env.BACKEND_URL,
        process.env.PLAYGROUND_URL,
    ],
}));
app.use((0, morgan_1.default)("common"));
app.use("/payment/webhook", body_parser_1.default.raw({ type: "*/*" }));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.json());
app.use("/photos", express_1.default.static("photos"));
app.use("/payment", stripe_1.default);
app.get("./photos/:name", (req, res) => {
    res.download(path_1.default.join("./photos", req.params.name));
});
exports.default = app;
//# sourceMappingURL=app.js.map