const mongoose = require("mongoose");

const guestUsageSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    // unique: true, 
  },
  count: {
    type: Number,
    default: 0,
  },
  date: {
    type: String, // store as simple "DD/MM/YYYY"
    required: true,
  },
});

module.exports = mongoose.model("GuestUsage", guestUsageSchema);
