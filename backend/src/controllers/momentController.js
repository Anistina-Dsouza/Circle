const Moment = require('../models/Moment');
const User = require('../models/User');
const Follow = require('../models/Follow');
const cloudinary = require('../utils/cloudinary');

// =========== CREATE MOMENT ===========
exports.createMoment = async (req, res) => {
  try {
    let { media, caption, duration, audience, visibleTo } = req.body;

    let mediaData = null;

    if (req.file) {
      // Local image/video upload via Cloudinary stream
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "circle/moments" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.on('error', (err) => reject(err));
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      mediaData = {
        url: result.secure_url,
        type: result.resource_type === 'video' ? 'video' : 'image'
      };
    } else if (media && media.url) {
      // Direct URL provided
      mediaData = media;
    } else {
      return res.status(400).json({ error: 'Media (file or url) is required' });
    }

    const moment = await Moment.create({
      user: req.userId,
      media: mediaData,
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
    console.error('Error creating moment:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== GET MOMENT FEED ===========
exports.getFeed = async (req, res) => {
  try {
    // Get users I follow (accepted follows only)
    const follows = await Follow.find({ 
      follower: req.userId,
      status: 'accepted'
    }).select('following');
    const followingIds = follows.map(f => f.following);
    followingIds.push(req.userId); // Include my own moments

    const moments = await Moment.find({
      $or: [
        { audience: 'public' },
        { 
          user: { $in: followingIds }, 
          audience: 'followers' 
        }
      ],
      expiresAt: { $gt: new Date() },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'username displayName profilePic')
      .populate('viewers', 'username displayName profilePic');

    // Separate followed stories from discover stories
    const followingMoments = [];
    const discoverMoments = [];
    const seenUsers = new Set();

    moments.forEach(m => {
      if (!m.user) return;
      const uid = m.user._id.toString();
      const isFriend = followingIds.some(id => id.toString() === uid);
      
      if (isFriend) {
        if (!seenUsers.has(uid)) {
          followingMoments.push(m);
          seenUsers.add(uid);
        }
      } else {
        discoverMoments.push(m);
      }
    });

    res.json({
      success: true,
      followingMoments,
      discoverMoments
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

    // Check if current user follows this user (accepted only)
    const isFollowing = req.userId ? await Follow.findOne({
      follower: req.userId,
      following: user._id,
      status: 'accepted'
    }) : null;

    const isOwnProfile = req.userId && user._id.toString() === req.userId;

    const query = {
      user: user._id,
      expiresAt: { $gt: new Date() },
      isActive: true
    };

    if (!isFollowing && !isOwnProfile) {
      // Only show public moments if not following and not own profile
      query.audience = 'public';
    } else {
      // Show public and followers-only moments
      query.audience = { $in: ['public', 'followers'] };
    }

    const moments = await Moment.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'username displayName profilePic')
      .populate('viewers', 'username displayName profilePic');

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
      .populate('user', 'username displayName profilePic')
      .populate('replies.user', 'username displayName')
      .populate('viewers', 'username displayName profilePic');

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    // Permission check
    const isOwner = moment.user?._id?.toString() === req.userId || moment.user?.toString() === req.userId;
    const isPublic = moment.audience === 'public';
    
    let canView = isOwner || isPublic;
    
    if (!canView && moment.audience === 'followers') {
      const isFollowing = await Follow.findOne({
        follower: req.userId,
        following: moment.user?._id || moment.user
      });
      if (isFollowing) canView = true;
    }

    if (!canView) {
      return res.status(403).json({ error: 'Not authorized to view this story' });
    }

    // Add view
    await moment.addView(req.userId);

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