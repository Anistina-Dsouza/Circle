const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  
  // Host
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Circle context (optional)
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle'
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined', 'maybe', 'attended'],
      default: 'invited'
    },
    joinedAt: Date,
    leftAt: Date,
    duration: Number // in minutes
  }],
  
  // Schedule
  startTime: {
    type: Date,
    required: true
  },
  scheduledDuration: {
    type: Number, // in minutes
    default: 60
  },
  endTime: Date,
  
  // Meeting room
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  
  // Settings
  settings: {
    allowRecording: { type: Boolean, default: false },
    allowScreenShare: { type: Boolean, default: true },
    allowChat: { type: Boolean, default: true },
    requirePassword: { type: Boolean, default: false },
    password: String,
    maxParticipants: { type: Number, default: 50 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'cancelled'],
    default: 'scheduled'
  },
  
  // Recording (if enabled)
  recording: {
    url: String,
    duration: Number,
    createdAt: Date
  },
  
  // Stats
  attendedCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
meetingSchema.index({ host: 1, startTime: -1 });
meetingSchema.index({ circle: 1, startTime: -1 });
meetingSchema.index({ status: 1, startTime: 1 });
meetingSchema.index({ roomId: 1 });

// Middleware
meetingSchema.pre('save', function(next) {
  // Update attended count
  if (this.participants) {
    this.attendedCount = this.participants.filter(p => p.status === 'attended').length;
  }
  
  // Update status based on time
  const now = new Date();
  if (this.startTime && this.endTime) {
    if (now < this.startTime) {
      this.status = 'scheduled';
    } else if (now >= this.startTime && now <= this.endTime) {
      this.status = 'live';
    } else {
      this.status = 'ended';
    }
  }
  
  next();
});

// Instance methods
meetingSchema.methods.addParticipant = function(userId, status = 'invited') {
  if (!this.participants.some(p => p.user.toString() === userId.toString())) {
    this.participants.push({
      user: userId,
      status: status
    });
  }
  return this.save();
};

meetingSchema.methods.updateParticipantStatus = function(userId, status) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.status = status;
    if (status === 'attended') {
      participant.joinedAt = new Date();
    }
  }
  return this.save();
};

meetingSchema.methods.startMeeting = function() {
  this.status = 'live';
  this.startTime = new Date();
  return this.save();
};

meetingSchema.methods.endMeeting = function() {
  this.status = 'ended';
  this.endTime = new Date();
  this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // minutes
  return this.save();
};

module.exports = mongoose.model('Meeting', meetingSchema);