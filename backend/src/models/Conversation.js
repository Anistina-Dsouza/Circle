// models/Conversation.js  ← ONLY for direct DMs between 2 people
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // No 'type' field needed — this model is ONLY for direct 1-on-1 DMs
  // Circle chat lives entirely in CircleMessage model

  participants: {
    type: [{
      user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      joinedAt:        { type: Date, default: Date.now },
      lastReadMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
      unreadCount:     { type: Number, default: 0 },
      isMuted:         { type: Boolean, default: false },
      mutedUntil:      { type: Date, default: null },
      isArchived:      { type: Boolean, default: false },
      isPinned:        { type: Boolean, default: false },
      nickname:        { type: String, default: null }
    }],
    validate: [
      {
        validator: function (p) { return p.length === 2; },
        message: 'A direct conversation must have exactly 2 participants.'
      },
      {
        validator: function (p) {
          const ids = p.map(x => x.user.toString());
          return new Set(ids).size === 2;
        },
        message: 'Both participants must be different users.'
      }
    ]
  },

  lastMessage:  { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  lastActivity: { type: Date, default: Date.now },

  // "Delete chat" — hides conversation from that user without losing messages
  deletedFor: [{
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: Date
  }],

  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// =========== INDEXES ===========
ConversationSchema.index({ 'participants.user': 1, lastActivity: -1 });

// Blocks duplicate DMs — works because pre-save sorts the IDs
// Previously had a unique index here on participants.user but MongoDB indexes arrays per-element,
// meaning a user could only ever be in ONE conversation globally. 
// Now we rely on findOrCreateDirect to deduplicate.

// =========== MIDDLEWARE ===========
// Sort participant IDs before saving so [A,B] and [B,A] are treated
// as the same conversation by the unique index above
ConversationSchema.pre('save', function () {
  if (this.isNew) {
    this.participants.sort((a, b) =>
      a.user.toString().localeCompare(b.user.toString())
    );
  }
});

// =========== STATIC METHODS ===========
// Always use this to start a DM — never call create() directly
ConversationSchema.statics.findOrCreateDirect = async function (userIdA, userIdB) {
  if (userIdA.toString() === userIdB.toString()) {
    throw new Error('Cannot create a conversation with yourself.');
  }

  const sorted = [userIdA.toString(), userIdB.toString()].sort();

  let convo = await this.findOne({
    'participants.user': { $all: sorted }
  });

  if (!convo) {
    convo = await this.create({
      participants: [{ user: sorted[0] }, { user: sorted[1] }]
    });
  }

  return convo;
};

// =========== INSTANCE METHODS ===========
// Returns the other person in the DM — useful for building chat header
ConversationSchema.methods.getOtherParticipant = function (myUserId) {
  return this.participants.find(p =>
    p.user.toString() !== myUserId.toString()
  );
};

// Call when user opens the conversation
ConversationSchema.methods.markRead = function (userId, messageId) {
  const p = this.participants.find(p => p.user.toString() === userId.toString());
  if (p) {
    p.lastReadMessage = messageId;
    p.unreadCount     = 0;
  }
  return this.save();
};

// Call when a new message is sent — bumps unread for receiver only
ConversationSchema.methods.updateLastMessage = function (messageId, senderUserId) {
  this.lastMessage  = messageId;
  this.lastActivity = new Date();

  this.participants.forEach(p => {
    if (p.user.toString() !== senderUserId.toString()) {
      p.unreadCount += 1;
    }
  });

  return this.save();
};

module.exports = mongoose.model('Conversation', ConversationSchema);