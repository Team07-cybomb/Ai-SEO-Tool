const express = require("express");
const router = express.Router();
const { saveAudit, getAudits } = require("../controllers/auditController");
const { verifyUser } = require("../middleware/auditMiddleware"); // 👈 user middleware
const { checkAuditLimit } = require("../middleware/checkAuditLimit");


// ✅ Attach middleware to routes
router.post("/create-audits", verifyUser, saveAudit); // saveAudit only for logged-in user
router.get("/audits", verifyUser, getAudits);        // getAudits only for logged-in user
router.post("/guest-audits", checkAuditLimit, saveAudit);
router.get("/audits", getAudits);

module.exports = router;


// const express = require("express");
// const { createAudit, getAudits } = require("../controllers/auditController");

// const router = express.Router();

// router.post("/create-audit", createAudit);
// router.get("/all", getAudits);

// module.exports = router;
