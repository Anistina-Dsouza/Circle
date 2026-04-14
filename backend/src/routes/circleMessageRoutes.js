const express = require('express');
const router = express.Router({ mergeParams: true }); // Need mergeParams: true if circleId comes from parent router, but here it's defined in the routes
const { protect } = require('../middleware/auth');
const circleMessageController = require('../controllers/circleMessageController');

// Apply authentication middleware to all routes
router.use(protect);

// Message CRUD
router.post('/:circleId/messages', circleMessageController.createMessage);
router.get('/:circleId/messages', circleMessageController.getMessages);
router.put('/:circleId/messages/:messageId', circleMessageController.updateMessage);
router.delete('/:circleId/messages/:messageId', circleMessageController.deleteMessage);

// Message Reactions
router.post('/:circleId/messages/:messageId/reactions', circleMessageController.toggleReaction);

// Mark as Read
router.post('/:circleId/messages/read', circleMessageController.markAsRead);

module.exports = router;
