const ConversationService = require('../services/conversationService');
const { getIo } = require('../sockets');

exports.startConversation = async (req, res) => {
  const { recipientId } = req.body
  console.log("here -",recipientId)
  console.log("here myId-",req.userId)
  const myId = req.userId

  // basic validation only
  if (!recipientId) return res.status(400).json({ error: 'recipientId required' })
  if (recipientId === myId.toString())
    return res.status(400).json({ error: 'Cannot DM yourself' })

  const conversation = await ConversationService.findOrCreate(myId, recipientId)

  try {
    getIo().to(myId.toString()).to(recipientId.toString()).emit('newConversation', conversation);
  } catch (err) {
    console.error('Socket error:', err);
  }

  res.status(200).json({ conversation })

}   

exports.getMyConversations = async (req, res) => {
  const conversations = await ConversationService.getMyList(req.userId)
  res.status(200).json({ conversations })
}


exports.getConversation = async (req, res) => {
  const conversation = await ConversationService.getById(
    req.params.conversationId,
    req.userId
  )
  res.status(200).json({ conversation })
}


exports.deleteConversation = async (req, res) => {
  await ConversationService.deleteForUser(
    req.params.conversationId,
    req.userId
  )
  res.status(200).json({ success: true })
}