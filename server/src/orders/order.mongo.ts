import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  created: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
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
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  reciever: {
    address: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: true,
      },
      postal_code: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model("Orders", orderSchema);
