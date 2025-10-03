const express = require('express');
const router = express.Router();
const keycheckerController = require('../controllers/keycheckerController');

// The new route for the recursive crawler replaces both old routes
router.post('/keychecker', keycheckerController.crawlAndScrape);

module.exports = router;