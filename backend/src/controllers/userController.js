const User = require('../models/User');
const Follow = require('../models/Follow');

// GET /api/users/:username
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password -email'); // Hide private fields
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if requesting user follows this user (if authenticated)
    let isFollowing = false;
    if (req.userId) {
      const follow = await Follow.findOne({
        follower: req.userId,
        following: user._id
      });
      isFollowing = !!follow;
    }
    
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        isFollowing
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/:username/followers
exports.getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user first
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get followers with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const followers = await Follow.find({ following: user._id })
      .populate('follower', 'username profile.displayName profile.profileImage stats')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Follow.countDocuments({ following: user._id });
    
    res.json({
      success: true,
      followers: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/:username/following
exports.getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const following = await Follow.find({ follower: user._id })
      .populate('following', 'username profile.displayName profile.profileImage stats')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Follow.countDocuments({ follower: user._id });
    
    res.json({
      success: true,
      following: following.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Allowed fields to update
    const allowedUpdates = {
      'profile.displayName': updates.displayName,
      'profile.bio': updates.bio,
      'profile.profileImage': updates.profileImage,
      'profile.coverImage': updates.coverImage
    };
    
    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/users/:userId/follow
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Cannot follow yourself
    if (userId === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.userId,
      following: userId
    });
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    
    // Create follow relationship
    await Follow.create({
      follower: req.userId,
      following: userId
    });
    
    // Update counts (denormalized)
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.followingCount': 1 }
    });
    
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.followersCount': 1 }
    });
    
    res.json({
      success: true,
      message: `You are now following ${userToFollow.username}`
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/users/:userId/unfollow
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if following
    const follow = await Follow.findOneAndDelete({
      follower: req.userId,
      following: userId
    });
    
    if (!follow) {
      return res.status(400).json({ error: 'Not following this user' });
    }
    
    // Update counts
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.followingCount': -1 }
    });
    
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.followersCount': -1 }
    });
    
    res.json({
      success: true,
      message: 'Unfollowed successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/search?q=query
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, users: [] });
    }
    
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.displayName': { $regex: q, $options: 'i' } }
      ]
    })
    .select('username profile.displayName profile.profileImage stats')
    .limit(10);
    
    res.json({
      success: true,
      users
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

