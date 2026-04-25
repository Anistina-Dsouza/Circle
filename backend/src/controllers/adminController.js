const User = require('../models/User');
const Circle = require('../models/Circle');
const Report = require('../models/Report');
const Meeting = require('../models/Meeting');
const CircleMessage = require('../models/CircleMessage');

const getDashboardStats = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalCircles,
      activeUsers,
      flaggedItems,
      latestUsers,
      latestCircles,
      categoryStats,
      userHourly,
      circleHourly,
      meetingHourly,
      userDaily,
      circleDaily,
      meetingDaily,
      latestReports,
      liveMeetings,
      totalMeetings,
      latestMeetings
    ] = await Promise.all([
      User.countDocuments(),
      Circle.countDocuments(),
      User.countDocuments({
        $or: [
          { 'onlineStatus.status': 'online' },
          { 'onlineStatus.lastSeen': { $gte: oneDayAgo } }
        ]
      }),
      Report.countDocuments({ status: 'pending' }),
      User.find({}).sort({ createdAt: -1 }).limit(5).select('username email displayName profilePic createdAt isActive isVerified onlineStatus'),
      Circle.find({}).sort({ createdAt: -1 }).limit(4).select('name category stats members coverImage'),
      
      Circle.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),

      User.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
      ]),
      Circle.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
      ]),
      Meeting.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }
      ]),

      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      Circle.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      Meeting.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      
      Report.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('reporter', 'username displayName')
        .select('reason reportedItemType createdAt status'),
        
      Meeting.countDocuments({ status: 'live' }),
      Meeting.countDocuments(),

      Meeting.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('host', 'username displayName profilePic')
        .select('title status createdAt roomId')
    ]);

    const combinedHourly = [];
    const currentHour = new Date().getHours();
    for (let i = 0; i < 24; i++) {
        const hour = (currentHour - 23 + i + 24) % 24;
        const uCount = userHourly.find(t => t._id === hour)?.count || 0;
        const cCount = circleHourly.find(t => t._id === hour)?.count || 0;
        const mCount = meetingHourly.find(t => t._id === hour)?.count || 0;
        
        combinedHourly.push({
            _id: `${hour}:00`,
            count: uCount + cCount + mCount
        });
    }

    const combinedDaily = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const uCount = userDaily.find(t => t._id === dateStr)?.count || 0;
        const cCount = circleDaily.find(t => t._id === dateStr)?.count || 0;
        const mCount = meetingDaily.find(t => t._id === dateStr)?.count || 0;

        combinedDaily.push({
            _id: dateStr,
            count: uCount + cCount + mCount
        });
    }

    const latestUsersWithReports = await Promise.all(latestUsers.map(async (u) => {
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

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCircles,
          activeUsers,
          flaggedItems,
          liveMeetings,
          totalMeetings
        },
        latestReports,
        trends: {
          registrations: combinedDaily,
          categories: categoryStats,
          hourly: combinedHourly
        },
        latestUsers: latestUsersWithReports,
        latestCircles,
        latestMeetings
      }
    });

  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dynamic dashboard stats',
      error: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password -resetPasswordToken -resetPasswordExpires');
    
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

const getDetailedResonance = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const aggregateResonance = async (Model) => {
      return await Model.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        {
          $group: {
            _id: {
              hour: { $hour: "$createdAt" },
              minute: {
                $subtract: [
                  { $minute: "$createdAt" },
                  { $mod: [{ $minute: "$createdAt" }, 15] }
                ]
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.hour": 1, "_id.minute": 1 } }
      ]);
    };

    const [userRes, circleRes, meetingRes] = await Promise.all([
      aggregateResonance(User),
      aggregateResonance(Circle),
      aggregateResonance(Meeting)
    ]);

    const timeline = [];
    const now = new Date();
    for (let i = 0; i < 96; i++) {
      const time = new Date(now.getTime() - (95 - i) * 15 * 60 * 1000);
      const hour = time.getHours();
      const minute = Math.floor(time.getMinutes() / 15) * 15;
      
      const findCount = (res) => res.find(r => r._id.hour === hour && r._id.minute === minute)?.count || 0;
      
      timeline.push({
        _id: `${hour}:${minute === 0 ? '00' : minute}`,
        count: findCount(userRes) + findCount(circleRes) + findCount(meetingRes)
      });
    }

    res.json({ success: true, data: timeline });
  } catch (error) {
    console.error('Detailed Resonance Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve detailed resonance map', error: error.message });
  }
};

const getCommunityDistribution = async (req, res) => {
  try {
    const categories = ['Technology', 'UI/UX Design', 'Gaming', 'Digital Art', 'Web3', 'Startups'];
    const distribution = await Circle.aggregate([
      {
        $group: {
          _id: "$category",
          circleCount: { $sum: 1 },
          totalMembers: { $sum: "$stats.memberCount" },
          totalMessages: { $sum: "$stats.messageCount" },
          avgActivity: { $avg: "$stats.messageCount" }
        }
      }
    ]);

    const fullDistribution = categories.map(cat => {
      const found = distribution.find(d => d._id === cat);
      return found || { _id: cat, circleCount: 0, totalMembers: 0, totalMessages: 0, avgActivity: 0 };
    }).sort((a, b) => b.totalMembers - a.totalMembers);

    const topCircles = await Circle.find({ isActive: true })
      .sort({ "stats.memberCount": -1 })
      .limit(5)
      .select('name category stats profilePic slug');

    res.json({ 
      success: true, 
      data: {
        distribution: fullDistribution,
        topCircles
      }
    });
  } catch (error) {
    console.error('Community Distribution Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve community audit map', error: error.message });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const userPage = parseInt(req.query.userPage) || 1;
    const circlePage = parseInt(req.query.circlePage) || 1;
    const meetingPage = parseInt(req.query.meetingPage) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const [users, circles, meetings, totalUsers, totalCircles, totalMeetings] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip((userPage - 1) * limit).limit(limit).select('username displayName profilePic createdAt onlineStatus'),
      Circle.find({}).sort({ createdAt: -1 }).skip((circlePage - 1) * limit).limit(limit).select('name category stats createdAt'),
      Meeting.find({}).sort({ createdAt: -1 }).skip((meetingPage - 1) * limit).limit(limit).populate('host', 'username displayName').select('title status createdAt host roomId'),
      User.countDocuments(),
      Circle.countDocuments(),
      Meeting.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        users,
        circles,
        meetings,
        pagination: {
            users: { total: totalUsers, page: userPage, totalPages: Math.ceil(totalUsers / limit) },
            circles: { total: totalCircles, page: circlePage, totalPages: Math.ceil(totalCircles / limit) },
            meetings: { total: totalMeetings, page: meetingPage, totalPages: Math.ceil(totalMeetings / limit) },
            limit
        }
      }
    });
  } catch (error) {
    console.error('Activity Logs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve activity telemetry', error: error.message });
  }
};

const getConversationalVelocity = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 1. Peak Signal Hours (Heatmap Data)
    const hourlySignal = await CircleMessage.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
            hour: { $hour: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1, "_id.hour": 1 } }
    ]);

    // 2. Message-to-Member Ratio (Active vs Lurking)
    // We'll take top 10 most active circles
    const circleEngagement = await Circle.find({ isActive: true })
      .sort({ "stats.messageCount": -1 })
      .limit(20)
      .select('name category stats');

    // 3. Response Latency Estimate (Based on reply-to)
    // Average time between message and its first reply
    const replies = await CircleMessage.find({ replyTo: { $ne: null } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('replyTo', 'createdAt');

    let totalLatency = 0;
    let validReplies = 0;
    replies.forEach(r => {
      if (r.replyTo && r.replyTo.createdAt) {
        const diff = (r.createdAt - r.replyTo.createdAt) / 1000 / 60; // in minutes
        if (diff > 0 && diff < 1440) { // filter out outliers > 24h
          totalLatency += diff;
          validReplies++;
        }
      }
    });

    const avgLatency = validReplies > 0 ? (totalLatency / validReplies).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        hourlySignal,
        circleEngagement,
        avgLatency,
        platformVolume: await CircleMessage.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
      }
    });
  } catch (error) {
    console.error('Conversational Velocity Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve engagement telemetry', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserSuspension,
  getAllCircles,
  toggleCircleStatus,
  dismissReports,
  getItemReports,
  getDetailedResonance,
  getCommunityDistribution,
  getActivityLogs,
  getConversationalVelocity
};
