const express=require('express')
const router=express.Router()
const {protect}=require('../middleware/auth')
const {startConversation,getMyConversations,deleteConversation,getConversation,getUnreadMessageCount}=require('../controllers/conversationController')
const {getMessages,sendMessage,editMessage,deleteMessage,reactToMessage,markAsRead}=require('../controllers/messageController')
router.use(protect)

router.get('/unread-count', getUnreadMessageCount)
router.post('/',startConversation)
router.get('/',getMyConversations)
router.get('/:conversationId',getConversation)
router.delete('/:conversationId',deleteConversation)

//Message routes
router.get('/:conversationId/messages',getMessages)
router.post('/:conversationId/messages',sendMessage)
router.put('/:conversationId/messages/:messageId',editMessage)
router.delete('/:conversationId/messages/:messageId',deleteMessage)
router.post('/:conversationId/messages/:messageId/react',reactToMessage)
router.post('/:conversationId/messages/:messageId/read',markAsRead)
router.post('/:conversationId/upload',markAsRead)

module.exports=router