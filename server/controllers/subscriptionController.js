const Subscription = require("../models/Subscription");
const connectDB = require("../config/db");
 
exports.subscribe = async (req, res) => {
  await connectDB();
  const { email } = req.body;
 
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
 
  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({ message: "This email is already subscribed." });
    }
 
    const newSubscription = new Subscription({ email });
    await newSubscription.save();
 
    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
}