const mongoose = require('mongoose');

const flashSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Content
  media: {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    duration: Number, // For videos in seconds
  },
  caption: {
    type: String,
    maxlength: 200
  },
  
  // Duration settings (in hours)
  duration: {
    type: Number,
    enum: [1, 6, 12, 24, 48],
    default: 24
  },
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Audience
  audience: {
    type: String,
    enum: ['public', 'followers', 'selected'],
    default: 'public'
  },
  visibleTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Engagement
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      maxlength: 200
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Stats
  viewCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
flashSchema.index({ user: 1, createdAt: -1 });
flashSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
flashSchema.index({ audience: 1, createdAt: -1 });

// Middleware
flashSchema.pre('save', function(next) {
  // Set expiresAt based on duration
  if (!this.expiresAt) {
    const hours = this.duration || 24;
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  
  // Update view count
  if (this.views) {
    this.viewCount = this.views.length;
  }
  
  // Update reply count
  if (this.replies) {
    this.replyCount = this.replies.length;
  }
  
  next();
});

// Instance methods
flashSchema.methods.addView = function(userId) {
  if (!this.views.some(v => v.user.toString() === userId.toString())) {
    this.views.push({
      user: userId,
      viewedAt: new Date()
    });
    this.viewCount = this.views.length;
  }
  return this.save();
};

flashSchema.methods.addReply = function(userId, message) {
  this.replies.push({
    user: userId,
    message: message,
    createdAt: new Date()
  });
  this.replyCount = this.replies.length;
  return this.save();
};

module.exports = mongoose.model('Flash', flashSchema);