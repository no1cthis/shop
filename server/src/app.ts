import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

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
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
// })

export default app;
