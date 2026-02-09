const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'follow',
      'message',
      'circle_invite',
      'circle_join',
      'flash_reply',
      'meeting_invite',
      'mention',
      'reaction',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Reference to related item
  relatedItem: {
    type: {
      type: String,
      enum: ['user', 'message', 'circle', 'flash', 'meeting']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedItem.type'
    }
  },
  
  // Sender info
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Expiry (for temporary notifications)
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  return notification.save();
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);