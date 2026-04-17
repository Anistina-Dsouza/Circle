const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const resetOnlineStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await User.updateMany(
      {},
      { $set: { 'onlineStatus.status': 'offline', 'onlineStatus.lastSeen': new Date() } }
    );

    console.log(`Reset ${result.modifiedCount} users to offline status.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

resetOnlineStatus();
