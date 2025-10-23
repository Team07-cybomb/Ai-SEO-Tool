const express = require('express');
const router = express.Router();
const keycheckerController = require('../controllers/keycheckerController');
const auth = require('../middleware/auth'); // Your existing auth middleware

// The new route for the recursive crawler replaces both old routes
router.post('/keychecker', auth, keycheckerController.crawlAndScrape);

// Routes for report management
router.get('/keychecker/report/:reportId', auth, keycheckerController.getReportById);
router.get('/keychecker/reports/url/:url', auth, keycheckerController.getReportsByUrl);
router.get('/keychecker/reports', auth, keycheckerController.getAllReports);
router.delete('/keychecker/report/:reportId', auth, keycheckerController.deleteReport);

module.exports = router;