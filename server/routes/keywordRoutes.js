const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');

// Save generated keyword report
router.post('/reports', keywordController.saveKeywordReport);

// Get keyword report by session ID
router.get('/reports/session/:sessionId', keywordController.getKeywordReportBySession);

// Get all keyword reports
router.get('/reports', keywordController.getAllKeywordReports);

// Get reports by industry
router.get('/reports/industry/:industry', keywordController.getKeywordReportsByIndustry);

// Get reports by topic
router.get('/reports/topic/:topic', keywordController.getKeywordReportsByTopic);

// Get analytics
router.get('/analytics', keywordController.getAnalytics);

// Delete keyword report
router.delete('/reports/:sessionId', keywordController.deleteKeywordReport);

// Health check
router.get('/health', keywordController.healthCheck);

module.exports = router;