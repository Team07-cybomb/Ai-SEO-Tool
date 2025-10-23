const express = require('express');
const router = express.Router();
const businessNameController = require('../controllers/businessNameController');
// Save generated names as single document
router.post('/names', businessNameController.saveGeneratedNames);

// Get names by session ID
router.get('/names/session/:sessionId', businessNameController.getNamesBySession);

// Get all sessions
router.get('/sessions', businessNameController.getAllSessions);

// Get analytics
router.get('/analytics', businessNameController.getAnalytics);

// Delete session
router.delete('/session/:sessionId', businessNameController.deleteSession);

module.exports = router;