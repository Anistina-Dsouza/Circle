const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  coverImage: {
    type: String,
    default: 'default_circle.png'
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Ownership
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator'],
      default: 'moderator'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Members
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Stats
  stats: {
    memberCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    flashCount: { type: Number, default: 0 },
    meetingCount: { type: Number, default: 0 }
  },
  
  // Settings
  settings: {
    allowMemberPosts: { type: Boolean, default: true },
    allowMemberInvites: { type: Boolean, default: true },
    requirePostApproval: { type: Boolean, default: false }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
circleSchema.index({ name: 'text', description: 'text' });
circleSchema.index({ type: 1, 'stats.memberCount': -1 });
circleSchema.index({ creator: 1 });
circleSchema.index({ slug: 1 });

// Middleware
circleSchema.pre('save', function(next) {
  // Generate slug
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }
  
  // Generate invite code for private circles
  if (this.type === 'private' && !this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  // Update member count
  if (this.members) {
    this.stats.memberCount = this.members.length;
  }
  
  next();
});

// Instance methods
circleSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.members.some(m => m.user.toString() === userId.toString())) {
    this.members.push({
      user: userId,
      role,
      joinedAt: new Date()
    });
    this.stats.memberCount = this.members.length;
  }
  return this.save();
};

circleSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  this.stats.memberCount = this.members.length;
  return this.save();
};

circleSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString());
};

module.exports = mongoose.model('Circle', circleSchema);