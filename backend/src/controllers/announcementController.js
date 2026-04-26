const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const { getIo } = require('../sockets');

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

    // Notify all active users
    const users = await User.find({ isActive: true }).select('email _id');
    
    // We process this in the background to avoid blocking the admin's response
    const dispatchPromises = users.map(async (user) => {
      try {
        // 1. Create In-App Notification
        const notification = await Notification.create({
          user: user._id,
          type: 'system',
          title: `Announcement: ${title}`,
          message: message,
          sender: req.user.id
        });

        // 2. Emit Socket.io Event for real-time update
        try {
          const io = getIo();
          io.to(`user_${user._id}`).emit('newNotification', notification);
        } catch (socketErr) {
          // Socket might not be initialized or user not connected
        }

        // 3. Send Email
        await sendEmail({
          email: user.email,
          subject: `New Announcement: ${title}`,
          message: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
              <h1 style="color: #6d28d9; margin-bottom: 20px;">${title}</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">${message}</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #6b7280;">
                <p>You are receiving this email because you have an account on Circle.</p>
                <p>&copy; 2026 Circle Platform. All rights reserved.</p>
              </div>
            </div>
          `
        });
      } catch (dispatchErr) {
        console.error(`Failed to notify user ${user._id}:`, dispatchErr.message);
      }
    });

    // Execute all dispatches without awaiting them to return response quickly
    Promise.all(dispatchPromises).then(() => {
      console.log(`[Announcements] Finished dispatching notifications for: ${title}`);
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created and dispatching to all users.',
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
