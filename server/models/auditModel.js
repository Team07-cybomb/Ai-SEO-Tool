// models/auditModel.js
const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  url: { type: String, required: true },
  date: { type: String, required: true },
  scores: {
    performance: { type: Number, default: 0 },
    seo: { type: Number, default: 0 },
    accessibility: { type: Number, default: 0 },
    bestPractices: { type: Number, default: 0 },
  },
  recommendations: [
    {
      text: String,
      priority: String,
    },
  ],
  analysis: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  // Link audit to logged-in user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("newAudit", auditSchema);
