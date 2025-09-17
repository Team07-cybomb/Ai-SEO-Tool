const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
    transactionId: { type: String, required: true, unique: true },
    expiryDate: { type: Date, required: true }, // plan expiry date
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
