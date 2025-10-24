const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['fruit', 'vegetable', 'protein', 'grain', 'dairy', 'other'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Food', foodSchema);
