const mongoose = require('mongoose');

const momentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
    duration: Number // For videos in seconds
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
    //required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete when expired
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
  
  viewCount: {
    type: Number,
    default: 0
  },
  
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
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
momentSchema.index({ user: 1, createdAt: -1 });
momentSchema.index({ audience: 1, createdAt: -1 });

// Set expiresAt before saving
momentSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    const hours = this.duration || 24;
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
});

// Simple methods
momentSchema.methods.addView = function() {
  this.viewCount += 1;
  return this.save();
};

momentSchema.methods.addReply = function(userId, message) {
  this.replies.push({
    user: userId,
    message,
    createdAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Moment', momentSchema);