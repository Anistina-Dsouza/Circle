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

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users safely excluding passwords
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password -resetPasswordToken -resetPasswordExpires');
    
    // Join logic: Calculate strictly pending user reports for each node footprint
    const usersWithReports = await Promise.all(users.map(async (u) => {
      const reportsCount = await Report.countDocuments({
        reportedItemId: u._id,
        reportedItemType: 'User',
        status: 'pending'
      });
      return {
        ...u.toObject(),
        pendingReports: reportsCount
      };
    }));

    res.status(200).json({
      success: true,
      data: usersWithReports
    });
  } catch (error) {
    console.error('All Users Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users directory map', error: error.message });
  }
};

const toggleUserSuspension = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User logic node not found.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administrators cannot be suspended natively via UI.' });
    }

    // Toggle the Active state completely
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User context ${user.isActive ? 'restored' : 'suspended'} successfully.`,
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('User Suspension Error:', error);
    res.status(500).json({ success: false, message: 'Failed to construct and persist status flip', error: error.message });
  }
};

const getAllCircles = async (req, res) => {
  try {
    const circles = await Circle.find({})
      .populate('creator', 'displayName username profilePic')
      .sort({ createdAt: -1 });

    const circlesWithReports = await Promise.all(circles.map(async (c) => {
      const reportsCount = await Report.countDocuments({
        reportedItemId: c._id,
        reportedItemType: 'Circle',
        status: 'pending'
      });
      return {
        ...c.toObject(),
        pendingReports: reportsCount
      };
    }));

    res.status(200).json({
      success: true,
      data: circlesWithReports
    });
  } catch (error) {
    console.error('All Circles Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve circles', error: error.message });
  }
};

const toggleCircleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const circle = await Circle.findById(id);

    if (!circle) {
      return res.status(404).json({ success: false, message: 'Circle not found.' });
    }

    circle.isActive = !circle.isActive;
    await circle.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Circle ${circle.isActive ? 'restored' : 'suspended'} successfully.`,
      data: {
        _id: circle._id,
        isActive: circle.isActive
      }
    });

  } catch (error) {
    console.error('Circle Suspension Error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle circle status', error: error.message });
  }
};

const dismissReports = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    await Report.updateMany(
      { reportedItemId: itemId, status: 'pending' },
      { $set: { status: 'dismissed', resolvedBy: req.user?._id, resolvedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'Reports dismissed successfully.'
    });
  } catch (error) {
    console.error('Dismiss Reports Error:', error);
    res.status(500).json({ success: false, message: 'Failed to dismiss reports', error: error.message });
  }
};

const getItemReports = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const reports = await Report.find({ 
      reportedItemId: itemId, 
      status: 'pending' 
    })
    .populate('reporter', 'displayName username profilePic')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get Item Reports Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserSuspension,
  getAllCircles,
  toggleCircleStatus,
  dismissReports,
  getItemReports
};
