const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Circle name is required'],
    trim: true,
    maxlength: [100, 'Circle name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=2629&auto=format&fit=crop'
  },
  profilePic: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/2102/2102633.png'
  },
  category: {
    type: String,
    default: 'Technology',
    index: true
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    index: true
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
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Members
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // ── CHAT ADDITION ──────────────────────────────────────
    // Tracks where each member last read — used for unread badge count
    lastReadMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CircleMessage',
      default: null
    },
    lastReadAt: {
      type: Date,
      default: null
    },
    // Per-member notification preference for this circle
    notifLevel: {
      type: String,
      enum: ['all', 'mentions', 'none'],
      default: 'all'
    },
    isMuted: { type: Boolean, default: false },
    mutedUntil: { type: Date, default: null }
    // ── END CHAT ADDITION ───────────────────────────────────
  }],

  pendingRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    introduction: {
      type: String,
      maxlength: 500,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  }],

  stats: {
    memberCount:  { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    flashCount:   { type: Number, default: 0 },
    meetingCount: { type: Number, default: 0 }
  },

  // Settings
  settings: {
    allowMemberPosts:    { type: Boolean, default: true },
    allowMemberInvites:  { type: Boolean, default: true },
    requirePostApproval: { type: Boolean, default: false },

    // ── CHAT ADDITION ──────────────────────────────────────
    // 0 = no slow mode. Any value = seconds a member must wait between messages
    slowMode: { type: Number, default: 0 },
    // Which content types members are allowed to send
    allowedContentTypes: {
      type: [String],
      enum: ['text', 'image', 'video', 'audio', 'file', 'poll', 'gif'],
      default: ['text', 'image', 'video', 'audio', 'file', 'gif']
    }
    // ── END CHAT ADDITION ───────────────────────────────────
  },

  // ── CHAT ADDITION ────────────────────────────────────────
  // Snapshot of the latest message — powers the circle list preview
  // exactly like WhatsApp group list
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CircleMessage',
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now   // updated every time a message is sent
  },
  // ── END CHAT ADDITION ─────────────────────────────────────

  // Status
  isActive:   { type: Boolean, default: true,  index: true },
  isFeatured: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

// =========== INDEXES ===========
circleSchema.index({ name: 'text', description: 'text' });
circleSchema.index({ type: 1, 'stats.memberCount': -1 });
circleSchema.index({ creator: 1 });
circleSchema.index({ 'members.user': 1 });
// ── CHAT ADDITION: sort circle list by latest activity ──
circleSchema.index({ lastActivity: -1 });
// ── END CHAT ADDITION ───────────────────────────────────

// =========== MIDDLEWARE ===========
circleSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (!this.inviteCode) {
    const timestamp = Date.now().toString(36);
    const random    = Math.random().toString(36).substring(2, 6);
    const nameHash  = (this.name || 'CIR').substring(0, 3).toUpperCase();
    this.inviteCode = `${nameHash}-${timestamp}-${random}`.toUpperCase();
  }

  if (this.members) {
    this.stats.memberCount = this.members.length;
  }
});

circleSchema.pre('save', function (next) {
  if (this.members && this.members.length > 0) {
    const seen = new Set();
    this.members = this.members.filter(member => {
      const userId = member.user.toString();
      if (seen.has(userId)) return false;
      seen.add(userId);
      return true;
    });
  }
});

// =========== VIRTUAL FIELDS ===========
circleSchema.virtual('isAdmin').get(function () {
  return (userId) => {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    return member && ['admin'].includes(member.role);
  };
});

// =========== INSTANCE METHODS ===========
circleSchema.methods.addMember = function (userId, role = 'member', invitedBy = null) {
  const existing = this.members.find(m => m.user.toString() === userId.toString());
  if (!existing) {
    this.members.push({
      user: userId,
      role,
      joinedAt: new Date(),
      invitedBy,
      // chat fields initialised to safe defaults — no extra work needed
      lastReadMessage: null,
      lastReadAt: null,
      notifLevel: 'all',
      isMuted: false
    });
    this.stats.memberCount = this.members.length;
  }
  return this.save();
};

circleSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  this.stats.memberCount = this.members.length;
  return this.save();
};

circleSchema.methods.isMember = function (userId) {
  return this.members.some(m => m.user.toString() === userId.toString());
};

circleSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member ? member.role : null;
};

circleSchema.methods.addModerator = function (userId, role = 'moderator', addedBy = null) {
  const existing = this.moderators.find(m => m.user.toString() === userId.toString());
  if (!existing) {
    this.moderators.push({ user: userId, role, addedAt: new Date(), addedBy });
  }
  return this.save();
};

circleSchema.methods.removeModerator = function (userId) {
  this.moderators = this.moderators.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

circleSchema.methods.isModerator = function (userId) {
  const isCreator    = this.creator.toString() === userId.toString();
  const inModerators = this.moderators.some(m => m.user.toString() === userId.toString());
  const isMemberMod  = this.members.some(m =>
    m.user.toString() === userId.toString() &&
    ['admin', 'moderator'].includes(m.role)
  );
  return isCreator || inModerators || isMemberMod;
};

// ── CHAT ADDITION: two new instance methods ─────────────────────────────────

// Call this every time a new CircleMessage is saved
// Usage: await circle.updateLastMessage(message._id)
circleSchema.methods.updateLastMessage = function (messageId) {
  this.lastMessage  = messageId;
  this.lastActivity = new Date();
  this.stats.messageCount += 1;
  return this.save();
};

// Call this when a member opens the circle chat
// Usage: await circle.markRead(userId, message._id)
circleSchema.methods.markRead = function (userId, messageId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (member) {
    member.lastReadMessage = messageId;
    member.lastReadAt      = new Date();
  }
  return this.save();
};

circleSchema.methods.incrementMeetingCount = function () {
  this.stats.meetingCount += 1;
  return this.save();
};

// ── END CHAT ADDITION ────────────────────────────────────────────────────────

// =========== STATIC METHODS ===========
circleSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true })
    .populate('creator', 'username profile.displayName profile.profileImage')
    .populate('members.user', 'username profile.displayName profile.profileImage');
};

circleSchema.statics.findByInviteCode = function (code) {
  return this.findOne({ inviteCode: code, isActive: true });
};

circleSchema.statics.getPopular = function (limit = 10) {
  return this.find({ isActive: true, type: 'public' })
    .sort({ 'stats.memberCount': -1, createdAt: -1 })
    .limit(limit)
    .select('name slug description coverImage stats memberCount');
};

module.exports = mongoose.model('Circle', circleSchema);