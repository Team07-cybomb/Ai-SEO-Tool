const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const auth = require('../middleware/auth'); // Your existing auth middleware

// The new route for the recursive crawler replaces both old routes
router.post('/crawl', auth, scraperController.crawlAndScrape);

router.get('/report/:reportId', auth, scraperController.getReportById);
router.get('/reports/domain/:domain', auth, scraperController.getDomainReports);

module.exports = router;
//module.exports = { processCrawlQueue };

//https://n8n.cybomb.com/webhook/optimize-crawl