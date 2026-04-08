const Announcement = require('../models/Announcement');

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide title and message' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      creator: req.user.id,
      reach: 0
    });

    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create announcement', error: error.message });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public (or protected for all logged-in users)
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('creator', 'displayName username profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Get Announcements Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve announcements', error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements
};
