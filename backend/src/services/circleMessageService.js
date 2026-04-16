const CircleMessage = require('../models/CircleMessage')
const Circle        = require('../models/Circle')

const getMessages = async (circleId, userId, { before, limit = 30 }) => {
  const circle = await Circle.findById(circleId);
  if (!circle) throw new Error('Circle not found');
  if (!circle.isMember(userId)) throw new Error('Unauthorized access');

  const query = {
    circleId,
    isDeleted: false,
    isHidden:  false
  }
  if (before) query._id = { $lt: before }  // cursor — load older

  const messages = await CircleMessage
    .find(query)
    .sort({ _id: -1 })        // newest first from DB
    .limit(limit)
    .populate('sender', 'username displayName profilePic onlineStatus')
    .populate({
      path:   'replyTo',
      select: 'content contentType sender isDeleted',
      populate: { path: 'sender', select: 'username displayName' }
    })
    .lean()                   // plain JS objects — faster

  return messages.reverse()  // flip to oldest→newest for chat UI
}

const createMessage = async ({ circleId, sender, content, contentType, replyTo, mentions }) => {
  const circle = await Circle.findById(circleId);
  if (!circle) throw new Error('Circle not found');
  if (!circle.isMember(sender)) throw new Error('Unauthorized access');

  const message = await CircleMessage.create({
    circleId,
    sender,
    content,
    contentType,
    replyTo,
    mentions
  });

  await circle.updateLastMessage(message._id);

  // Populate references
  await message.populate([
    { path: 'sender', select: 'username displayName profilePic onlineStatus' },
    { path: 'replyTo', select: 'content contentType sender isDeleted', populate: { path: 'sender', select: 'username displayName' } }
  ]);

  return message;
};

const updateMessage = async (messageId, userId, text) => {
  const message = await CircleMessage.findOne({ _id: messageId, sender: userId });
  if (!message) throw new Error('Message not found or unauthorized');
  if (message.isDeleted) throw new Error('Cannot edit a deleted message');

  message.editHistory.push({
    text: message.content?.text || '',
    editedAt: new Date()
  });

  if (!message.content) message.content = {};
  message.content.text = text;
  message.isEdited = true;

  await message.save();
  await message.populate('sender', 'username displayName profilePic onlineStatus');
  return message;
};

const deleteMessage = async (messageId, userId) => {
  const message = await CircleMessage.findById(messageId);
  if (!message) throw new Error('Message not found');

  const circle = await Circle.findById(message.circleId);
  
  const isSender = message.sender.toString() === userId.toString();
  const isModerator = circle && circle.isModerator(userId);

  if (!isSender && !isModerator) {
    throw new Error('Unauthorized to delete this message');
  }

  message.isDeleted = true;
  message.deletedAt = new Date();
  message.deletedBy = userId;

  await message.save();
  return true;
};

const toggleReaction = async (messageId, userId, emoji) => {
  const message = await CircleMessage.findById(messageId);
  if (!message) throw new Error('Message not found');

  const userIdStr = userId.toString();
  const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);

  if (reactionIndex === -1) {
    message.reactions.push({ emoji, users: [userId] });
  } else {
    const reactionObj = message.reactions[reactionIndex];
    const userIndex = reactionObj.users.findIndex(u => u.toString() === userIdStr);

    if (userIndex > -1) {
      reactionObj.users.splice(userIndex, 1);
      if (reactionObj.users.length === 0) {
        message.reactions.splice(reactionIndex, 1);
      }
    } else {
      reactionObj.users.push(userId);
    }
  }

  await message.save();
  return message.reactions;
};

const markRead = async (circleId, userId, lastMessageId) => {
  const circle = await Circle.findById(circleId);
  if (!circle) throw new Error('Circle not found');
  if (!circle.isMember(userId)) return false;

  await circle.markRead(userId, lastMessageId);
  return true;
};

module.exports = {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  toggleReaction,
  markRead
};