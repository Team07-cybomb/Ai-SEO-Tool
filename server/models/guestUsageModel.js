// models/guestUsageModel.js
const mongoose = require("mongoose");

const guestUsageSchema = new mongoose.Schema({
  guestId: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  date: { type: String, required: true }, // format: "DD/MM/YYYY"
});

module.exports = mongoose.model("GuestUsage", guestUsageSchema);
