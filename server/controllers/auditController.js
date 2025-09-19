const Audit = require("../models/auditModel"); // ✅ Ensure correct model

// Save Audit
exports.saveAudit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

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
};
    const audit = new Audit(auditData);
    await audit.save();

    res.status(201).json(audit);
  } catch (err) {
    console.error("Save Audit Error:", err);
    res.status(500).json({ message: "Error saving audit", error: err.message });
  }
};

// Get Audits for logged-in user
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
