const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // For personal chat
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // For group chat
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle'
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  },
  
  // Content
  content: {
    text: {
      type: String,
      maxlength: 2000
    },
    media: [{
      url: String,
      type: {
        type: String,
        enum: ['image', 'video', 'file', 'audio']
      },
      thumbnail: String,
      filename: String,
      size: Number
    }]
  },
  
  // Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  
  // Replies
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Mentions
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Metadata
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ circle: 1, channel: 1, createdAt: -1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ 'content.text': 'text' });

// Instance methods
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from same user
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    emoji: emoji
  });
  
  return this.save();
};

messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);