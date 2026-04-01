const User = require('../models/User');
const Circle = require('../models/Circle');
const Report = require('../models/Report');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Get total counts
    const totalUsers = await User.countDocuments();
    const totalCircles = await Circle.countDocuments();

    // Active users: online status is 'online' or lastSeen within 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      $or: [
        { 'onlineStatus.status': 'online' },
        { 'onlineStatus.lastSeen': { $gte: oneDayAgo } }
      ]
    });

    // Flagged items -> Pending reports
    const flaggedItems = await Report.countDocuments({ status: 'pending' });

    // 2. Get latest registrations (top 5 users)
    const latestUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email displayName profilePic isVerified isActive createdAt');

    // 3. Get latest circles (top 4 circles)
    const latestCircles = await Circle.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name category stats members coverImage');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCircles,
          activeUsers,
          flaggedItems
        },
        latestUsers,
        latestCircles
      }
    });

  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
