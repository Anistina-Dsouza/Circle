const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const Circle = require('../models/Circle');

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
      .populate('follower', 'username displayName profilePic stats')
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
      .populate('following', 'username displayName profilePic stats')
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
    const finalUpdates = {};

    // Handle File Uploads (if any)
    if (req.files) {
      if (req.files.profilePic?.[0]) {
        finalUpdates.profilePic = req.files.profilePic[0].path;
      }
      if (req.files.coverImage?.[0]) {
        finalUpdates.coverImage = req.files.coverImage[0].path;
      }
    }

    // Allowed text fields
    if (updates.displayName !== undefined) finalUpdates.displayName = updates.displayName;
    if (updates.bio !== undefined) finalUpdates.bio = updates.bio;
    
    // Support URL fallbacks if no file was uploaded
    if (updates.profilePicUrl && !finalUpdates.profilePic) finalUpdates.profilePic = updates.profilePicUrl;
    if (updates.coverImageUrl && !finalUpdates.coverImage) finalUpdates.coverImage = updates.coverImageUrl;

    // Handle nested fields (they might come as JSON strings in FormData)
    if (updates.preferences) {
      finalUpdates.preferences = typeof updates.preferences === 'string' 
        ? JSON.parse(updates.preferences) 
        : updates.preferences;
    }
    if (updates.privacy) {
      finalUpdates.privacy = typeof updates.privacy === 'string' 
        ? JSON.parse(updates.privacy) 
        : updates.privacy;
    }

    if (Object.keys(finalUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: finalUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log("updated user", user);

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

    // Send notification
    try {
      await Notification.createNotification({
        user: userId,
        type: 'follow',
        title: 'New Follower',
        message: 'started following you',
        sender: req.userId,
        relatedItem: { type: 'user', id: req.userId }
      });
    } catch (err) {
      console.error('Failed to create follow notification:', err);
    }

    // Update counts (denormalized)
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.followingCount': 1 }
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.followerCount': 1 }
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
      $inc: { 'stats.followerCount': -1 }
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
        { displayName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('username displayName profilePic stats')
      .limit(10);

    res.json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/suggestions
exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // 1. Get IDs of users already followed
    const following = await Follow.find({ follower: currentUserId }).select('following');
    const followingIds = following.map(f => f.following.toString());
    followingIds.push(currentUserId.toString()); // Exclude self

    // 2. Find Interests (Categories of circles I've joined)
    const myJoinedCircles = await Circle.find({ 'members.user': currentUserId }).select('category members.user');
    const myCategories = [...new Set(myJoinedCircles.map(c => c.category).filter(Boolean))];

    // 3. Find people in SAME INTEREST/CATEGORY circles
    let interestIds = [];
    if (myCategories.length > 0) {
      const similarCircles = await Circle.find({ 
        category: { $in: myCategories },
        'members.user': { $ne: currentUserId }
      }).select('members.user').limit(20);
      
      interestIds = similarCircles
        .flatMap(c => c.members.map(m => m.user.toString()))
        .filter(id => !followingIds.includes(id));
    }

    // 4. Find mutual friends (users followed by people I follow)
    const mutuals = await Follow.find({ 
      follower: { $in: following.map(f => f.following) } 
    })
    .limit(50)
    .select('following');
    
    const mutualIds = mutuals
      .map(f => f.following.toString())
      .filter(id => !followingIds.includes(id));

    // 5. Find people in EXACT same circles
    const circleMemberIds = myJoinedCircles
      .flatMap(c => c.members.map(m => m.user.toString()))
      .filter(id => !followingIds.includes(id));

    // 6. Fallback: Popular users
    const popularUsers = await User.find({ 
      _id: { $nin: followingIds } 
    })
    .sort({ 'stats.followerCount': -1 })
    .limit(20)
    .select('_id');

    const popularIds = popularUsers.map(u => u._id.toString());

    // Combine all and shuffle/limit
    // Weight: Interests > Mutuals > Same Circles > Popular
    const allSuggestedIds = [...new Set([...interestIds, ...mutualIds, ...circleMemberIds, ...popularIds])];
    
    // Fetch full profiles for the top suggestions
    const suggestedUsers = await User.find({
      _id: { $in: allSuggestedIds.slice(0, 20) }
    })
    .select('username displayName profilePic bio stats')
    .limit(12);

    res.json({
      success: true,
      users: suggestedUsers
    });

  } catch (error) {
    console.error('getSuggestedUsers Error:', error);
    res.status(500).json({ error: error.message });
  }
};
