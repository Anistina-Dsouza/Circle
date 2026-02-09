const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['text', 'voice', 'announcement'],
    default: 'text'
  },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Permissions
  permissions: {
    sendMessages: {
      type: String,
      enum: ['everyone', 'moderators', 'specific'],
      default: 'everyone'
    },
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    mentionEveryone: {
      type: Boolean,
      default: false
    }
  },
  
  // Settings
  isPrivate: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    default: 0
  },
  
  // Stats
  messageCount: {
    type: Number,
    default: 0
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
channelSchema.index({ circle: 1, position: 1 });
channelSchema.index({ circle: 1, lastActivity: -1 });
channelSchema.index({ 'circle': 1, 'isPrivate': 1 });

// Instance methods
channelSchema.methods.updateLastActivity = function(messageId) {
  this.lastActivity = new Date();
  this.lastMessage = messageId;
  this.messageCount += 1;
  return this.save();
};

module.exports = mongoose.model('Channel', channelSchema);