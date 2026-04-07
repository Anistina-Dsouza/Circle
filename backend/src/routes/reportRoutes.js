const express = require('express');
const router = express.Router();
const { submitReport } = require('../controllers/reportController');
const { auth } = require('../middleware/auth');

// @route   POST /api/reports
// @desc    Submit a new report
// @access  Private
router.post('/', auth, submitReport);

module.exports = router;
