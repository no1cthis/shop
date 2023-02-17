import mongoose from "mongoose";

const reservedSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  created: {
    type: Number,
    required: true,
  },
  products: [
    {
      title: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
export default mongoose.model("Reservs", reservedSchema);
