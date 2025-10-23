const express = require('express');
const router = express.Router();
const businessNameController = require('../controllers/businessNameController');
const auth = require('../middleware/auth'); // Your existing auth middleware

// Save generated names as single document
router.post('/names', auth, businessNameController.saveGeneratedNames);

// Get names by session ID
router.get('/names/session/:sessionId', auth, businessNameController.getNamesBySession);

// Get all sessions
router.get('/sessions', auth, businessNameController.getAllSessions);

// Get analytics
router.get('/analytics', auth, businessNameController.getAnalytics);

// Delete session
router.delete('/session/:sessionId', auth, businessNameController.deleteSession);

module.exports = router;