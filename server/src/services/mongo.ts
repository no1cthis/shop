import mongoose from "mongoose";
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  if (MONGO_URL) mongoose.connect(MONGO_URL);
  else console.log("Connection to mongo denied");
}
async function mongoDisconnect() {
  mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
