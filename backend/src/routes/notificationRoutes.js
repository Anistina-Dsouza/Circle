const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  clearAll,
  deleteNotification
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);
router.delete('/clear-all', clearAll);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
