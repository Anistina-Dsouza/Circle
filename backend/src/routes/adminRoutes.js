const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics, top users, and new circles
// @access  Private/Admin
router.get('/dashboard', adminAuth, getDashboardStats);

module.exports = router;
