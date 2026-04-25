const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const { auth, adminAuth } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cacheMiddleware');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private (available to all logged in users)
// Cache global announcements for 1 hour (3600 seconds)
router.get('/', auth, cacheMiddleware(3600), getAnnouncements);

// @route   POST /api/announcements
// @desc    Create an announcement
// @access  Private/Admin
router.post('/', adminAuth, createAnnouncement);

module.exports = router;
