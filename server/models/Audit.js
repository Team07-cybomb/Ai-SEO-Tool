// server/models/Audit.js
const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  userEmail: { type: String },
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", auditSchema);
