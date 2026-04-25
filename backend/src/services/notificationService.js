const Notification = require('../models/Notification');
const User = require('../models/User');

const processMentions = async (text, senderId, relatedItemType = null, relatedItemId = null) => {
  if (!text || typeof text !== 'string') return;
  
  // Extract usernames starting with @
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = [...text.matchAll(mentionRegex)];
  const usernames = matches.map(m => m[1]);
  
  if (usernames.length === 0) return;
  
  // Find unique users
  const uniqueUsernames = [...new Set(usernames)];
  
  // Look up users
  const users = await User.find({ username: { $in: uniqueUsernames } });
  
  // Filter out the sender themselves
  const mentionedUsers = users.filter(u => u._id.toString() !== senderId.toString());
  
  // Create notifications
  for (const user of mentionedUsers) {
    try {
      const notificationData = {
        user: user._id,
        type: 'mention',
        title: 'New Mention',
        message: `mentioned you in a post`,
        sender: senderId
      };

      if (relatedItemType && relatedItemId) {
        notificationData.relatedItem = {
          type: relatedItemType,
          id: relatedItemId
        };
      }

      await Notification.createNotification(notificationData);
    } catch (err) {
      console.error('Failed to create mention notification:', err);
    }
  }
};

module.exports = {
  processMentions
};
