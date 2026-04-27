const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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

// Public routes
router.get('/suggestions', protect, getSuggestedUsers);
// Cache search results for 1 minute
router.get('/search', cacheMiddleware(60), searchUsers);
// Cache profiles for 1 minute
router.get('/:username', protect, cacheMiddleware(60), getUserProfile);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

// Protected routes
router.put('/profile', protect, updateProfile);
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/unfollow', protect, unfollowUser);

module.exports = router;