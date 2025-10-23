const express = require('express');
const router = express.Router();
const keycheckerController = require('../controllers/keycheckerController');

// The new route for the recursive crawler replaces both old routes
router.post('/keychecker', keycheckerController.crawlAndScrape);

// Routes for report management
router.get('/keychecker/report/:reportId', keycheckerController.getReportById);
router.get('/keychecker/reports/url/:url', keycheckerController.getReportsByUrl);
router.get('/keychecker/reports', keycheckerController.getAllReports);
router.delete('/keychecker/report/:reportId', keycheckerController.deleteReport);

module.exports = router;