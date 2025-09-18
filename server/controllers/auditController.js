const Audit = require("../models/auditModel");
 
exports.saveAudit = async (req, res) => {
  try {
    const auditData = {
      ...req.body,
      userId: req.user._id, // ✅ add userId from logged-in user
    };

    const audit = new Audit(auditData);
    await audit.save();

    res.status(201).json({ message: "Audit saved successfully", audit });
  } catch (err) {
    res.status(500).json({ message: "Error saving audit", error: err.message });
  }
};
 
exports.getAudits = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ JWT middleware மூலம் வந்த userId

    // அந்த user-க்கு மட்டும் audits எடுத்துக்கோ
    const audits = await Audit.find({ userId }).sort({ createdAt: -1 });

    res.json(audits);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching audits", error: err.message });
  }
};


// // Create new audit report
// exports.createAudit = async (req, res) => {
//   try {
//     const audit = await Audit.create(req.body);
//     res.status(201).json({ success: true, audit });
//   } catch (err) {
//     console.error("Audit Create Error:", err);
//     res.status(500).json({ success: false, message: "Error creating audit" });
//   }
// };

// // Get all audit reports
// exports.getAudits = async (req, res) => {
//   try {
//     const audits = await Audit.find().sort({ createdAt: -1 });
//     res.json({ success: true, audits });
//   } catch (err) {
//     console.error("Get Audit Error:", err);
//     res.status(500).json({ success: false, message: "Error fetching audits" });
//   }
// };
