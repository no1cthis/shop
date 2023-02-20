import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import stripe from "./stripe/stripe";

dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      process.env.PLAYGROUND_URL,
    ],
  })
);
//@ts-ignore
app.use(morgan("common"));
app.use("/payment/webhook", bodyParser.raw({ type: "*/*" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use("/photos", express.static("photos"));
app.use("/payment", stripe);
app.get("./photos/:name", (req, res) => {
  res.download(path.join("./photos", req.params.name));
});

export default app;
