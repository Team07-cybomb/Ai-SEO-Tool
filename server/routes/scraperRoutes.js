const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

// The new route for the recursive crawler replaces both old routes
router.post('/crawl', scraperController.crawlAndScrape);

router.get('/report/:reportId', scraperController.getReportById);
router.get('/reports/domain/:domain', scraperController.getDomainReports);
module.exports = router;
//module.exports = { processCrawlQueue };

//https://n8n.cybomb.com/webhook/optimize-crawl