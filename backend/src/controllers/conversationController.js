const ConversationService = require('../services/conversationService');

exports.startConversation = async (req, res) => {
  const { recipientId } = req.body
  const myId = req.user._id

  // basic validation only
  if (!recipientId) return res.status(400).json({ error: 'recipientId required' })
  if (recipientId === myId.toString())
    return res.status(400).json({ error: 'Cannot DM yourself' })

  const conversation = await ConversationService.findOrCreate(myId, recipientId)
  res.status(200).json({ conversation })

}   

exports.getMyConversations = async (req, res) => {
  const conversations = await ConversationService.getMyList(req.user._id)
  res.status(200).json({ conversations })
}


exports.getConversation = async (req, res) => {
  const conversation = await ConversationService.getById(
    req.params.conversationId,
    req.user._id
  )
  res.status(200).json({ conversation })
}


exports.deleteConversation = async (req, res) => {
  await ConversationService.deleteForUser(
    req.params.conversationId,
    req.user._id
  )
  res.status(200).json({ success: true })
}