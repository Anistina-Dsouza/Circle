const MessageService = require('../services/messageService');
const { getIo } = require('../sockets');
const { processMentions } = require('../services/notificationService');

exports.getMessages = async (req, res) => {
  try {
    const { before, limit = 30 } = req.query;
    const messages = await MessageService.getMessages(
      req.params.conversationId,
      req.userId,
      { before, limit: Math.min(Number(limit), 50) }
    );
    res.status(200).json({ messages });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const { content, contentType, replyTo } = req.body;
    if (!content?.text && !content?.mediaUrl)
      return res.status(400).json({ error: 'Message cannot be empty' });

    const message = await MessageService.createMessage({
      conversationId: req.params.conversationId,
      sender: req.userId,
      content, contentType, replyTo
    });

    if (content?.text) {
      processMentions(content.text, req.userId, 'message', message._id).catch(err => console.error(err));
    }

    try {
      getIo().to(req.params.conversationId).emit('newMessage', message);
    } catch (err) {
      console.error('Socket error:', err);
    }

    res.status(201).json({ message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.editMessage = async (req, res) => {
  const { text } = req.body
  if (!text?.trim())
    return res.status(400).json({ error: 'Text cannot be empty' })

  const message = await MessageService.editMessage(
    req.params.messageId,
    req.userId,
    text.trim()
  )

  try {
    getIo().to(req.params.conversationId).emit('messageUpdated', message);
  } catch (err) {
    console.error('Socket error:', err);
  }

  res.status(200).json({ message })
}

exports.deleteMessage = async (req, res) => {
  const { deleteFor = 'everyone' } = req.body
  await MessageService.deleteMessage(
    req.params.messageId,
    req.userId,
    deleteFor   // 'me' | 'everyone'
  )

  if (deleteFor === 'everyone') {
    try {
      getIo().to(req.params.conversationId).emit('messageDeleted', { messageId: req.params.messageId });
    } catch (err) {
      console.error('Socket error:', err);
    }
  }

  res.status(200).json({ success: true })
}

exports.reactToMessage = async (req, res) => {
  const { emoji } = req.body
  if (!emoji)
    return res.status(400).json({ error: 'emoji required' })

  const reactions = await MessageService.toggleReaction(
    req.params.messageId,
    req.userId,
    emoji
  )

  try {
    getIo().to(req.params.conversationId).emit('messageReacted', { messageId: req.params.messageId, reactions });
  } catch (err) {
    console.error('Socket error:', err);
  }

  res.status(200).json({ reactions })
}

exports.markAsRead = async (req, res) => {
  const { lastMessageId } = req.body
  await MessageService.markRead(
    req.params.conversationId,
    req.userId,
    lastMessageId
  )

  try {
    getIo().to(req.params.conversationId).emit('messagesRead', { conversationId: req.params.conversationId, userId: req.userId, lastMessageId });
  } catch (err) {
    console.error('Socket error:', err);
  }

  res.status(200).json({ success: true })
}