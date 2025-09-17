const express = require("express");
const router = express.Router();
const { saveAudit, getAudits } = require("../controllers/auditController");
 
router.post("/create-audits", saveAudit);
router.get("/audits", getAudits);
 
module.exports = router;

// const express = require("express");
// const { createAudit, getAudits } = require("../controllers/auditController");

// const router = express.Router();

// router.post("/create-audit", createAudit);
// router.get("/all", getAudits);

// module.exports = router;
