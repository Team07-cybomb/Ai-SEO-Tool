// models/newAudit.js
const mongoose = require("mongoose");
 
const auditSchema = new mongoose.Schema({
  url: { type: String, required: true },
  date: { type: String, required: true },
  scores: {
    performance: Number,
    seo: Number,
    accessibility: Number,
    bestPractices: Number,
  },
  recommendations: [
    {
      text: String,
      priority: String,
    },
  ],
  analysis: String,
  createdAt: { type: Date, default: Date.now },
 
  // 👇 User ID reference
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
 
module.exports = mongoose.model("newAudit", auditSchema);