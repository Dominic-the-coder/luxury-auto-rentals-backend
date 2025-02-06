const { Schema, model } = require("mongoose");

const carSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  // linkage between the cars and categories (Similar to SQL foreign key)
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  image: String,
});

const Car = model("Car", carSchema);

module.exports = Car;