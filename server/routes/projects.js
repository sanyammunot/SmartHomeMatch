const express = require('express');
const { matchAgencies } = require('../controllers/projectController');
const router = express.Router();

// AI Matching Endpoint
router.post('/match', matchAgencies);

module.exports = router;