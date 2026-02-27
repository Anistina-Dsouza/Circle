const Moment = require('../models/Moment');
const User = require('../models/User');
const Follow = require('../models/Follow');

// =========== CREATE MOMENT ===========
exports.createMoment = async (req, res) => {
  try {
    const { media, caption, duration, audience, visibleTo } = req.body;

    if (!media || !media?.url) {
      return res.status(400).json({ error: 'Media is required' });
    }
    
    const moment = await Moment.create({
      user: req.userId,
      media,
      caption,
      duration: duration || 24,
      audience: audience || 'public',
      visibleTo: audience === 'selected' ? visibleTo : []
    });

    // Update user's moment count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.momentCount': 1 }
    });

    res.status(201).json({
      success: true,
      moment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET MOMENT FEED ===========
exports.getFeed = async (req, res) => {
  try {
    // Get users I follow
    const follows = await Follow.find({ follower: req.userId }).select('following');
    const followingIds = follows.map(f => f.following);
    followingIds.push(req.userId); // Include my own moments

    const moments = await Moment.find({
      user: { $in: followingIds },
      audience: 'public',
      expiresAt: { $gt: new Date() },
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'username profile.displayName profile.profileImage');

    res.json({
      success: true,
      moments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET USER MOMENTS ===========
exports.getUserMoments = async (req, res) => {
  try {
    console.log(req.params)
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    console.log(user)  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const moments = await Moment.find({
      user: user._id,
      audience: 'public',
      expiresAt: { $gt: new Date() },
      isActive: true
    })
    .sort({ createdAt: -1 })
    .populate('user', 'username profile.displayName profile.profileImage');

    console.log("fetching stories : ",moments)
    res.json({
      success: true,
      moments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET SINGLE MOMENT ===========
exports.getMoment = async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.momentId)
      .populate('user', 'username profile.displayName profile.profileImage')
      .populate('replies.user', 'username profile.displayName');

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    // Add view
    await moment.addView();

    res.json({
      success: true,
      moment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== DELETE MOMENT ===========
exports.deleteMoment = async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.momentId);

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    if (moment.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await moment.deleteOne(); // Hard delete

    // Update user's moment count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.momentCount': -1 }
    });

    res.json({
      success: true,
      message: 'Moment deleted'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== REPLY TO MOMENT ===========
exports.replyToMoment = async (req, res) => {
  try {
    const { message } = req.body;
    const moment = await Moment.findById(req.params.momentId);

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    await moment.addReply(req.userId, message);

    res.json({
      success: true,
      message: 'Reply added'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};