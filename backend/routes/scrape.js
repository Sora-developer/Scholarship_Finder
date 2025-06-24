const express = require('express');
const router = express.Router();
const { runScraper } = require('../controllers/scrapeController');

router.get('/', runScraper);

module.exports = router;
// This route handles GET requests to the /scrape endpoint
// and invokes the runScraper function from the scrapeController.