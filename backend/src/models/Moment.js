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
    enum: [1, 6, 12, 24, 48, 168],
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

  viewers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    validate: {
      validator: function(v) {
        // Enforce uniqueness within the array instead of using `unique: true` 
        // which would restrict a user to only exist in ONE moment across the entire app!
        // Using `unique: true` on a field inside a schema creates a unique index in MongoDB,
        // which would prevent the same user ID from appearing in the viewers list of any other document.
        return v.length === new Set(v.map(id => id.toString())).size;
      },
      message: 'User already exists in viewers array'
    }
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

  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      required: true
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
momentSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const hours = this.duration || 24;
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
});

// Simple methods
momentSchema.methods.addView = function (userId) {
  if (!userId) return Promise.resolve(this);
  
  // Don't add own view
  const ownerId = this.user && this.user._id ? this.user._id.toString() : this.user.toString();
  if (userId.toString() === ownerId) return Promise.resolve(this);

  const userIdStr = userId.toString();
  const alreadyViewed = this.viewers.some(v => {
    const vId = v && v._id ? v._id.toString() : (v ? v.toString() : '');
    return vId === userIdStr;
  });

  if (!alreadyViewed) {
    // Use atomic update to prevent React Strict Mode duplicate updates
    return this.constructor.updateOne(
      { _id: this._id, viewers: { $ne: userId } },
      {
        $addToSet: { viewers: userId },
        $inc: { viewCount: 1 }
      }
    ).then(() => this);
  }
  return Promise.resolve(this);
};

momentSchema.methods.addReply = function (userId, message) {
  this.replies.push({
    user: userId,
    message,
    createdAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Moment', momentSchema);