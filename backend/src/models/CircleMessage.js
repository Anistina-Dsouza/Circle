// models/CircleMessage.js  ← ONLY for circle group chat
const mongoose = require('mongoose');

const CircleMessageSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    text:      { type: String, default: null },
    mediaUrl:  { type: String, default: null },
    mediaType: { type: String, default: null },
    fileName:  { type: String, default: null },
    fileSize:  { type: Number, default: null },
    mimeType:  { type: String, default: null },
    thumbnail: { type: String, default: null },
    duration:  { type: Number, default: null }
  },

  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'gif', 'poll', 'system'],
    default: 'text'
  },

  // Reply to another message in the same circle
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CircleMessage',
    default: null
  },

  // @mentions — lets you query "all messages where I was mentioned"
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Reactions: [{ emoji: '🔥', users: [userId, ...] }]
  reactions: [{
    emoji: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],

  // Pinned by a moderator/admin
  isPinned:  { type: Boolean, default: false },
  pinnedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pinnedAt:  { type: Date, default: null },

  // Edit support
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    text:     String,
    editedAt: { type: Date, default: Date.now }
  }],

  // Soft delete — mod can delete anyone's message, user can delete their own
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Mod can hide without deleting (content review)
  isHidden:    { type: Boolean, default: false },
  reportCount: { type: Number, default: 0 },

  // Forwarded from another circle message
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CircleMessage',
    default: null
  },

  // system messages: "Raj joined the circle", "Circle name changed" etc.
  systemData: { type: mongoose.Schema.Types.Mixed, default: null },

  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// =========== INDEXES ===========
// Core: load messages for a circle, oldest first
CircleMessageSchema.index({ circleId: 1, createdAt: 1 });
// Cursor-based pagination (scroll up)
CircleMessageSchema.index({ circleId: 1, _id: -1 });
// Pinned messages tab
CircleMessageSchema.index({ circleId: 1, isPinned: 1 });
// Mention notifications: "find all messages that mention me"
CircleMessageSchema.index({ mentions: 1 });
// Sender lookup (moderation / account deletion)
CircleMessageSchema.index({ sender: 1 });

module.exports = mongoose.model('CircleMessage', CircleMessageSchema);