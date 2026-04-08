const User = require('../models/User');
const Conversation = require('../models/Conversation');

const findOrCreate = async (userIdA, userIdB) => {
  // check if either user blocked the other
  const blocked = await User.exists({
    _id: userIdA,
    blockedUsers: userIdB
  });
  if (blocked) throw new Error('Cannot message this user');

  return Conversation.findOrCreateDirect(userIdA, userIdB);
};

const getMyList = async (userId) => {
  return Conversation.find({
    'participants.user': userId,
    'deletedFor.user': { $ne: userId }
  })
    .populate('participants.user', 'username displayName profilePic onlineStatus')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });
};

const getById = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    'participants.user': userId
  })
    .populate('participants.user', 'username displayName profilePic onlineStatus')
    .populate('lastMessage');

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
};

const deleteForUser = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    'participants.user': userId
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Check if already deleted
  const alreadyDeleted = conversation.deletedFor.some(
    d => d.user?.toString() === userId.toString()
  );

  if (!alreadyDeleted) {
    conversation.deletedFor.push({ user: userId, deletedAt: new Date() });
    await conversation.save();
  }

  return true;
};

module.exports = {
  findOrCreate,
  getMyList,
  getById,
  deleteForUser
};
