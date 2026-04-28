const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/auth');
const {
  getUserProfile,
  getFollowers,
  getFollowing,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers
} = require('../controllers/userController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/ping', (req, res) => res.json({ message: 'User router is alive' }));
router.get('/suggestions', protect, getSuggestedUsers);
router.get('/suggested-list', protect, getSuggestedUsers); // Alias for backward compatibility
// Cache search results for 1 minute
router.get('/search', optionalProtect, cacheMiddleware(60), searchUsers);
// Cache profiles for 1 minute
router.get('/:username', protect, cacheMiddleware(60), getUserProfile);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

// Protected routes
router.put('/profile', protect, upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), updateProfile);
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/unfollow', protect, unfollowUser);

module.exports = router;