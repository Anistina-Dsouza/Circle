const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/auth');
const momentController = require('../controllers/momentController');

// Public/Optional Auth
router.get('/user/:username', optionalProtect, momentController.getUserMoments);

// Protected
router.use(protect);
router.get('/feed', momentController.getFeed);
router.get('/:momentId', momentController.getMoment);
router.post('/', momentController.createMoment);
router.delete('/:momentId', momentController.deleteMoment);
router.post('/:momentId/reply', momentController.replyToMoment);

module.exports = router;