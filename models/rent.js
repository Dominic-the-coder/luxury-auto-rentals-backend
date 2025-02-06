const { Schema, model } = require("mongoose");

const rentSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  cars: {
    type: Array,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending", // pending, paid, failed, completed
    enum: ["pending", "paid", "failed", "completed"], // enum limit the value to the provided options only
  },
  billplz_id: String, // the ID from the bill in billplz
  paid_at: Date,
});

const Rent = model("Rent", rentSchema);
module.exports = Rent;
