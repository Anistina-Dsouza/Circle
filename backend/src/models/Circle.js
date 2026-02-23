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
    default: 'default_circle.png'
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
    }
  }],

  // Stats
  stats: {
    memberCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    flashCount: { type: Number, default: 0 },
    meetingCount: { type: Number, default: 0 }
  },

  // Settings
  settings: {
    allowMemberPosts: { type: Boolean, default: true },
    allowMemberInvites: { type: Boolean, default: true },
    requirePostApproval: { type: Boolean, default: false }
  },

  // Status
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =========== INDEXES ===========
circleSchema.index({ name: 'text', description: 'text' });
circleSchema.index({ type: 1, 'stats.memberCount': -1 });
circleSchema.index({ creator: 1 });
circleSchema.index({ 'members.user': 1 }); // Added for member lookup

// =========== MIDDLEWARE ===========
circleSchema.pre('save', function (next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
  }

  // Generate unique invite code for private circles
  if (this.type === 'private' && !this.inviteCode) {
    // More unique: timestamp + random + name hash
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    const nameHash = this.name.substring(0, 3).toUpperCase();
    this.inviteCode = `${nameHash}-${timestamp}-${random}`.toUpperCase();
  }

  // Update member count
  if (this.members) {
    this.stats.memberCount = this.members.length;
  }

  // next();
});

// Ensure member list doesn't have duplicates
circleSchema.pre('save', function (next) {
  if (this.members && this.members.length > 0) {
    // Remove duplicate members by user ID
    const seen = new Set();
    this.members = this.members.filter(member => {
      const userId = member.user.toString();
      if (seen.has(userId)) return false;
      seen.add(userId);
      return true;
    });
  }
  // next();
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
  // Check if already member
  const existing = this.members.find(m => m.user.toString() === userId.toString());
  if (!existing) {
    this.members.push({
      user: userId,
      role,
      joinedAt: new Date(),
      invitedBy
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
  // Check if already moderator
  const existing = this.moderators.find(m => m.user.toString() === userId.toString());
  if (!existing) {
    this.moderators.push({
      user: userId,
      role,
      addedAt: new Date(),
      addedBy
    });
  }
  return this.save();
};

circleSchema.methods.removeModerator = function (userId) {
  this.moderators = this.moderators.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

circleSchema.methods.isModerator = function (userId) {
  const isCreator = this.creator.toString() === userId.toString();
  const inModerators = this.moderators.some(m => m.user.toString() === userId.toString());
  const isMemberMod = this.members.some(m =>
    m.user.toString() === userId.toString() &&
    ['admin', 'moderator'].includes(m.role)
  );

  return isCreator || inModerators || isMemberMod;
};

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
  return this.find({
    isActive: true,
    type: 'public'
  })
    .sort({ 'stats.memberCount': -1, createdAt: -1 })
    .limit(limit)
    .select('name slug description coverImage stats memberCount');
};

module.exports = mongoose.model('Circle', circleSchema);