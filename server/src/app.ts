import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
//@ts-ignore
app.use(morgan("common"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
// })

export default app;
