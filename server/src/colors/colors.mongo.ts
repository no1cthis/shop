import mongoose from "mongoose";

const colorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Colors", colorsSchema);
