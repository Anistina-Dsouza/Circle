const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const getMessages = async (conversationId, userId, { before, limit }) => {
  // Verify access
  const convo = await Conversation.findOne({
    _id: conversationId,
    'participants.user': userId
  });
  
  if (!convo) {
    throw new Error('Conversation not found or unauthorized');
  }

  const query = {
    conversationId,
    'deletedFor.user': { $ne: userId }
  };

  if (before) {
    query._id = { $lt: before };
  }

  const messages = await Message.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .populate('sender', 'username displayName profilePic onlineStatus')
    .populate('replyTo', 'content contentType sender isDeleted');
  
  // Return in chronological order for frontend chat
  //  window (oldest first)
  return messages.reverse();
};

const createMessage = async ({ conversationId, sender, content, contentType, replyTo }) => {
  // Verify access
  const convo = await Conversation.findOne({
    _id: conversationId,
    'participants.user': sender
  });

  if (!convo) {
    throw new Error('Conversation not found');
  }

  const message = await Message.create({
    conversationId,
    sender,
    content,
    contentType,
    replyTo
  });

  // Call the instance method on Conversation to update lastMessage and bumps unreads
  await convo.updateLastMessage(message._id, sender);

  await message.populate('sender', 'username displayName profilePic onlineStatus');
  
  if (replyTo) {
    await message.populate('replyTo', 'content contentType sender isDeleted');
  }

  return message;
};

const editMessage = async (messageId, userId, text) => {
  const message = await Message.findOne({ _id: messageId, sender: userId });
  
  if (!message) {
    throw new Error('Message not found or unauthorized');
  }

  if (message.isDeleted) {
    throw new Error('Cannot edit a deleted message');
  }

  // Keep a record of what it was
  message.editHistory.push({
    text: message.content?.text || '',
    editedAt: new Date()
  });

  if (!message.content) {
    message.content = {};
  }
  
  // Set the new text and edited flag
  message.content.text = text;
  message.isEdited = true;

  await message.save();
  await message.populate('sender', 'username displayName profilePic onlineStatus');

  return message;
};

const deleteMessage = async (messageId, userId, deleteFor) => {
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new Error('Message not found');
  }

  if (deleteFor === 'everyone') {
    if (message.sender.toString() !== userId.toString()) {
      throw new Error('Unauthorized to delete for everyone');
    }
    message.isDeleted = true;
    message.deletedAt = new Date();
    // Notice: we do not clear the content directly to allow edit history / tombstone UI if desired,
    // though this depends on how the frontend handles isDeleted
  } else {
    // deleteFor === 'me'
    const alreadyDeleted = message.deletedFor.some(
      d => d.user?.toString() === userId.toString()
    );
    
    if (!alreadyDeleted) {
      message.deletedFor.push({ user: userId, deletedAt: new Date() });
    }
  }

  await message.save();
  return true;
};

const toggleReaction = async (messageId, userId, emoji) => {
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new Error('Message not found');
  }

  const userIdStr = userId.toString();
  const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);

  if (reactionIndex === -1) {
    // New reaction
    message.reactions.push({ emoji, users: [userId] });
  } else {
    const reactionObj = message.reactions[reactionIndex];
    const userHasReactedAt = reactionObj.users.findIndex(u => u.toString() === userIdStr);

    if (userHasReactedAt > -1) {
      // User has already reacted, so remove it
      reactionObj.users.splice(userHasReactedAt, 1);
      
      // Clean up the emoji group if nobody is reacting with it anymore
      if (reactionObj.users.length === 0) {
        message.reactions.splice(reactionIndex, 1);
      }
    } else {
      // Add the user to an existing emoji reaction
      reactionObj.users.push(userId);
    }
  }

  await message.save();
  return message.reactions;
};

const markRead = async (conversationId, userId, lastMessageId) => {
  const convo = await Conversation.findOne({
    _id: conversationId,
    'participants.user': userId
  });

  if (!convo) {
    throw new Error('Conversation not found');
  }

  // Delegate the logic to unbump the unread flag in the conversation
  await convo.markRead(userId, lastMessageId);

  if (lastMessageId) {
    // Update all previous messages as read between these users
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        _id: { $lte: lastMessageId },
        isRead: false
      },
      {
        $set: { isRead: true, readAt: new Date() }
      }
    );
  }

  return true;
};

module.exports = {
  getMessages,
  createMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  markRead
};
