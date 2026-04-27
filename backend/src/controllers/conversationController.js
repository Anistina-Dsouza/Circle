const ConversationService = require('../services/conversationService');
const { getIo } = require('../sockets');

exports.startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const myId = req.userId;

    if (!recipientId) return res.status(400).json({ error: 'recipientId required' });
    if (recipientId === myId.toString())
      return res.status(400).json({ error: 'Cannot DM yourself' });

    const conversation = await ConversationService.findOrCreate(myId, recipientId);

    try {
      getIo().to(myId.toString()).to(recipientId.toString()).emit('newConversation', conversation);
    } catch (err) {
      console.error('Socket error:', err);
    }

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await ConversationService.getMyList(req.userId);
    res.status(200).json({ conversations });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await ConversationService.getById(
      req.params.conversationId,
      req.userId
    );
    res.status(200).json({ conversation });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    await ConversationService.deleteForUser(
      req.params.conversationId,
      req.userId
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};