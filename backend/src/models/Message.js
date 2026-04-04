// models/Message.js  ← ONLY for direct DM messages
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
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
    mediaType: { type: String, default: null },  // 'image'|'video'|'audio'|'file'
    fileName:  { type: String, default: null },
    fileSize:  { type: Number, default: null },
    mimeType:  { type: String, default: null },
    thumbnail: { type: String, default: null },
    duration:  { type: Number, default: null }   // seconds, for audio/video
  },

  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'gif', 'system'],
    default: 'text'
  },

  // Reply to another message in the same DM
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // Reactions: [{ emoji: '👍', users: [userId, ...] }]
  reactions: [{
    emoji: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],

  // Read receipt — only 1 other person in a DM so this is simple
  isRead:  { type: Boolean, default: false },
  readAt:  { type: Date, dfault: null },

  // Edit support
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    text:     String,
    editedAt: { type: Date, default: Date.now }
  }],

  // "Delete for me" vs "Delete for everyone"
  isDeleted:  { type: Boolean, default: false },
  deletedAt:  { type: Date, default: null },
  deletedFor: [{
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: Date
  }],

  // Forwarded from another DM message
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // system messages: "You connected on CircleApp" etc.
  systemData: { type: mongoose.Schema.Types.Mixed, default: null },

  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// =========== INDEXES ===========
// Core: load messages for a conversation, oldest first for chat UI
MessageSchema.index({ conversationId: 1, createdAt: 1 });
// Cursor-based pagination (scroll up to load older messages)
MessageSchema.index({ conversationId: 1, _id: -1 });
// Find all messages sent by a user (for account deletion / data export)
MessageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', MessageSchema);