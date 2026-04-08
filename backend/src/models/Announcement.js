const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reach: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
