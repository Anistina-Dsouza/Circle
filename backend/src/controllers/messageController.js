const MessageService = require('../services/messageService');

exports.getMessages = async (req, res) => {
  const { before, limit = 30 } = req.query
  const messages = await MessageService.getMessages(
    req.params.conversationId,
    req.user._id,
    { before, limit: Math.min(Number(limit), 50) }
  )
  res.status(200).json({ messages })
}


exports.sendMessage = async (req, res) => {
  const { content, contentType, replyTo } = req.body
  if (!content?.text && !content?.mediaUrl)
    return res.status(400).json({ error: 'Message cannot be empty' })

  const message = await MessageService.createMessage({
    conversationId: req.params.conversationId,
    sender: req.user._id,
    content, contentType, replyTo
  })
  res.status(201).json({ message })
}


exports.editMessage = async (req, res) => {
  const { text } = req.body
  if (!text?.trim())
    return res.status(400).json({ error: 'Text cannot be empty' })

  const message = await MessageService.editMessage(
    req.params.messageId,
    req.user._id,
    text.trim()
  )
  res.status(200).json({ message })
}

exports.deleteMessage = async (req, res) => {
  const { deleteFor = 'everyone' } = req.body
  await MessageService.deleteMessage(
    req.params.messageId,
    req.user._id,
    deleteFor   // 'me' | 'everyone'
  )
  res.status(200).json({ success: true })
}

exports.reactToMessage = async (req, res) => {
  const { emoji } = req.body
  if (!emoji)
    return res.status(400).json({ error: 'emoji required' })

  const reactions = await MessageService.toggleReaction(
    req.params.messageId,
    req.user._id,
    emoji
  )
  res.status(200).json({ reactions })
}

exports.markAsRead = async (req, res) => {
  const { lastMessageId } = req.body
  await MessageService.markRead(
    req.params.conversationId,
    req.user._id,
    lastMessageId
  )
  res.status(200).json({ success: true })
}