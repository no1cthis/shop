import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  buyCount: {
    type: Number,
    required: true,
  },
  allSizes: {
    type: [Number],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  color: [
    {
      name: {
        type: String,
        required: true,
      },
      sizesAvailable: {
        _36: {
          type: Number,
          required: true,
        },
        _37: {
          type: Number,
          required: true,
        },
        _38: {
          type: Number,
          required: true,
        },
        _39: {
          type: Number,
          required: true,
        },
        _40: {
          type: Number,
          required: true,
        },
        _41: {
          type: Number,
          required: true,
        },
        _42: {
          type: Number,
          required: true,
        },
        _43: {
          type: Number,
          required: true,
        },
        _44: {
          type: Number,
          required: true,
        },
        _45: {
          type: Number,
          required: true,
        },
        _46: {
          type: Number,
          required: true,
        },
        _47: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

export default mongoose.model("Products", productsSchema);
