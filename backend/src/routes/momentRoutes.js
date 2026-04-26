const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/auth');
const momentController = require('../controllers/momentController');
const upload = require('../middleware/upload');
const cacheMiddleware = require('../middleware/cacheMiddleware');

// Public/Optional Auth
// Cache a user's specific moments/stories for 30 seconds
router.get('/user/:username', optionalProtect, cacheMiddleware(30), momentController.getUserMoments);

// Protected
router.use(protect);
// Cache the personalized feed for 30 seconds (safe because we append userId in middleware)
router.get('/feed', cacheMiddleware(30), momentController.getFeed);
router.get('/:momentId', cacheMiddleware(60), momentController.getMoment);
router.post('/', upload.single('media'), momentController.createMoment);
router.delete('/:momentId', momentController.deleteMoment);
router.post('/:momentId/reply', momentController.replyToMoment);
router.post('/:momentId/react', momentController.reactToMoment);

module.exports = router;