const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const auth = require('../middleware/auth'); // Your existing auth middleware

// Save generated keyword report
router.post('/reports', auth, keywordController.saveKeywordReport);

// Get keyword report by session ID
router.get('/reports/session/:sessionId', auth, keywordController.getKeywordReportBySession);

// Get all keyword reports
router.get('/reports', auth, keywordController.getAllKeywordReports);

// Get reports by industry
router.get('/reports/industry/:industry', auth, keywordController.getKeywordReportsByIndustry);

// Get reports by topic
router.get('/reports/topic/:topic', auth, keywordController.getKeywordReportsByTopic);

// Get analytics
router.get('/analytics', auth, keywordController.getAnalytics);

// Delete keyword report
router.delete('/reports/:sessionId', auth, keywordController.deleteKeywordReport);


module.exports = router;