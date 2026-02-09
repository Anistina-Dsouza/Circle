const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 25
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  displayName: {
    type: String,
    trim: true,
    default: function() {
      return this.username;
    }
  },
  profilePic: {
    type: String,
    default: 'default_avatar.png'
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Following system
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Stats (cached)
  stats: {
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    circleCount: { type: Number, default: 0 },
    flashCount: { type: Number, default: 0 }
  },
  
  // Online status
  onlineStatus: {
    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'busy'],
      default: 'offline'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  
  // Privacy settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public'
    },
    messagePrivacy: {
      type: String,
      enum: ['everyone', 'followers', 'none'],
      default: 'everyone'
    },
    showOnlineStatus: { type: Boolean, default: true }
  },
  
  // Account status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  
  // Security
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ username: 'text', displayName: 'text' });
userSchema.index({ 'onlineStatus.status': 1, 'onlineStatus.lastSeen': -1 });
userSchema.index({ createdAt: -1 });

// Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Update follower/following counts
  if (this.isModified('followers')) {
    this.stats.followerCount = this.followers.length;
  }
  if (this.isModified('following')) {
    this.stats.followingCount = this.following.length;
  }
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);