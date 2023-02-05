import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ProductTypes", productTypeSchema);
