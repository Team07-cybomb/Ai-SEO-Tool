const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Plan / Pricing Info
  isPro: { 
    type: Boolean, 
    default: false    // free users = false, paid = true
  },
  plan: { 
    type: String, 
    enum: ["free", "basic", "pro"], 
    default: "free"   // default plan free
  },
  proExpiry: { 
    type: Date, 
    default: null     // set only if user pays
  },
 
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
  },

  
  { timestamps: true }

);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema, "users");
