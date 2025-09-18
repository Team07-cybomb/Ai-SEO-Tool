// middleware/checkAuditLimit.js
const GuestUsage = require("../models/guestUsageModel");

async function checkAuditLimit(req, res, next) {
  try {
    const today = new Date().toLocaleDateString();

    if (req.user) {
      return next();
    }

    // const guestId = req.cookies.guestId || req.body.guestId;
    const guestId = req.body?.guestId;

if (!guestId) {
  console.error("Audit limit check failed: guestId is missing", req.body);
  return res.status(400).json({ success: false, message: "guestId is required" });
}

    if (!guestId) {
      return res.status(400).json({ message: "Missing guestId" });
    }

    let guest = await GuestUsage.findOne({ guestId });

    if (!guest) {
      guest = new GuestUsage({ guestId, count: 1, date: today });
      await guest.save();
      return next();
    }

    if (guest.date !== today) {
      guest.count = 0;
      guest.date = today;
    }

    if (guest.count >= 3) {
      return res
        .status(403)
        .json({ message: "🚀 Free audits used up! Please login to continue." });
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
