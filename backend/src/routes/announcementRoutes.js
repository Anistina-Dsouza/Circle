const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private (available to all logged in users)
router.get('/', auth, getAnnouncements);

// @route   POST /api/announcements
// @desc    Create an announcement
// @access  Private/Admin
router.post('/', adminAuth, createAnnouncement);

module.exports = router;
