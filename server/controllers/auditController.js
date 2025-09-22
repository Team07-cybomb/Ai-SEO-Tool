const Audit = require("../models/auditModel");
const GuestUsage = require("../models/guestUsageModel");

// Save Audit
exports.saveAudit = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-GB");
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // ✅ Guest logic (if no logged-in user)
    if (!req.user || !req.user._id) {
      let guest = await GuestUsage.findOne({ ip, date: today });

      if (!guest) {
        guest = new GuestUsage({ ip, count: 1, date: today });
        await guest.save();
      } else {
        if (guest.count >= 3) {
          return res.status(403).json({
            success: false,
            message: "🚀 Free audits used up for today. Please login or register.",
          });
        }
        guest.count += 1;
        await guest.save();
      }

      return res.status(200).json({
        success: true,
        message: `Guest audit #${guest.count} completed`,
        audit: req.body,
      });
    }

    // ✅ Logged-in user: save audit normally
const { url, scores, recommendations, analysis, performance, seo, accessibility, bestPractices } = req.body;
 
const auditData = {

  url,

  date: new Date().toLocaleDateString("en-GB"),

  scores: {

    performance: scores?.performance || performance || 0,

    seo: scores?.seo || seo || 0,

    accessibility: scores?.accessibility || accessibility || 0,

    bestPractices: scores?.bestPractices || bestPractices || 0,

  },

  recommendations: recommendations || [],

  analysis: analysis || "",

  userId: req.user._id,

  date: today,

};
 
    const audit = new Audit(auditData);
    await audit.save();

    res.status(201).json({ success: true, message: "Audit saved successfully", audit:req.body });

  } catch (err) {
    console.error("Save Audit Error:", err);
    res.status(500).json({ message: "Error saving audit", error: err.message });
  }
};


// ---------------- Get Audits ----------------
exports.getAudits = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    // ✅ Filter by userId
    const audits = await Audit.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // ✅ Send plain array for frontend mapping
    res.status(200).json(audits);
  } catch (err) {
    console.error("Get Audits Error:", err);
    res.status(500).json({ message: "Error fetching audits", error: err.message });
  }
};
