const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'accepted'
  },
  followedAt: {
    type: Date,
    default: Date.now
  },
  notifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1, followedAt: -1 });

// Static methods
followSchema.statics.getFollowers = async function(userId) {
  return this.find({ following: userId, status: 'accepted' })
    .populate('follower', 'username displayName profilePic')
    .lean();
};

followSchema.statics.getFollowing = async function(userId) {
  return this.find({ follower: userId, status: 'accepted' })
    .populate('following', 'username displayName profilePic')
    .lean();
};

followSchema.statics.isFollowing = async function(followerId, followingId) {
  const follow = await this.findOne({
    follower: followerId,
    following: followingId,
    status: 'accepted'
  });
  return !!follow;
};

module.exports = mongoose.model('Follow', followSchema);