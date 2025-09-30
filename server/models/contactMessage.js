const mongoose = require("mongoose");
 
const ContactMessageSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high", "urgent" ], default: "medium" },
    type: { type: String, enum: ["technical", "billing", "general", "feature"], default: "general" }
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("ContactMessage", ContactMessageSchema);