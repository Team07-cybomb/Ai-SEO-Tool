const express = require("express");
const router = express.Router();
const { saveAudit, getAudits } = require("../controllers/auditController");
const { verifyUser } = require("../middleware/auditMiddleware");

// ✅ Secure routes with middleware
router.post("/create-audits", verifyUser, saveAudit);
router.get("/audits", verifyUser, getAudits);

module.exports = router;


// const express = require("express");
// const { createAudit, getAudits } = require("../controllers/auditController");

// const router = express.Router();

// router.post("/create-audit", createAudit);
// router.get("/all", getAudits);

// module.exports = router;
