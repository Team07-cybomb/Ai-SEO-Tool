// middleware/checkAuditLimit.js
const GuestUsage = require("../models/guestUsageModel");

async function checkAuditLimit(req, res, next) {
  try {
    const today = new Date().toLocaleDateString();

    // Logged-in user? ✅ skip limit
    if (req.user) {
      return next();
    }

    // Get client IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    if (!ip) {
      console.error("❌ Could not detect IP");
      return res.status(400).json({ success: false, message: "IP is required" });
    }

    let guest = await GuestUsage.findOne({ ip });

    if (!guest) {
      guest = new GuestUsage({ ip, count: 1, date: today });
      await guest.save();
      return next();
    }

    // Reset count if new day
    if (guest.date !== today) {
      guest.count = 0;
      guest.date = today;
    }

    if (guest.count >= 3) {
      return res
        .status(403)
        .json({ success: false, message: "🚀 Free audits used up! Please login to continue." });
    }

    guest.count += 1;
    await guest.save();

    next();
  } catch (err) {
    console.error("Audit limit check failed:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { checkAuditLimit };
