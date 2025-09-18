const Audit = require("../models/auditModel");
const GuestUsage = require("../models/guestUsageModel"); // ✅ new guest usage model

// ---------------- Save Audit ----------------
exports.saveAudit = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-GB");

    // ✅ If no logged-in user, treat as guest
    if (!req.user || !req.user._id) {
      const guestId = req.body.guestId || req.cookies.guestId;
      if (!guestId) {
        return res.status(400).json({ success: false, message: "Missing guestId" });
      }

      let guest = await GuestUsage.findOne({ guestId });

      if (!guest) {
        guest = new GuestUsage({ guestId, count: 1, date: today });
        await guest.save();
      } else {
        // reset if new day
        if (guest.date !== today) {
          guest.count = 0;
          guest.date = today;
        }

        if (guest.count >= 3) {
          return res
            .status(403)
            .json({ success: false, message: "🚀 Free audits used up. Please login." });
        }

        guest.count += 1;
        await guest.save();
      }

      // Don’t save audit in DB for guests, just return the data
      return res.status(200).json({
        success: true,
        message: `Guest audit #${guest.count} completed`,
        audit: req.body,
      });
    }

    // ✅ Logged-in user: save audit in DB
    const { url, seo, performance, accessibility, bestPractices, recommendations, analysis } = req.body;

    const auditData = {
      url,
      seo,
      performance,
      accessibility,
      bestPractices,
      recommendations,
      analysis,
      userId: req.user._id, // always from JWT
      date: today,
    };

    const audit = new Audit(auditData);
    await audit.save();

    res.status(201).json({ success: true, message: "Audit saved successfully", audit });
  } catch (err) {
    console.error("Save Audit Error:", err);
    res.status(500).json({ success: false, message: "Error saving audit", error: err.message });
  }
};

// ---------------- Get Audits ----------------
exports.getAudits = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
    }

    const audits = await Audit.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: audits.length,
      audits,
    });
  } catch (err) {
    console.error("Get Audits Error:", err);
    res.status(500).json({ success: false, message: "Error fetching audits", error: err.message });
  }
};
