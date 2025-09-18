const Audit = require("../models/auditModel");

exports.saveAudit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
    }

    // Only take allowed fields from req.body
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
      date: new Date().toLocaleDateString("en-GB"), // default date
    };

    const audit = new Audit(auditData);
    await audit.save();

    res.status(201).json({ success: true, message: "Audit saved successfully", audit });
  } catch (err) {
    console.error("Save Audit Error:", err);
    res.status(500).json({ success: false, message: "Error saving audit", error: err.message });
  }
};

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
