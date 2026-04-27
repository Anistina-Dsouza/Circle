const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const circleController = require('../controllers/circleController');
const upload = require('../middleware/upload');

const cacheMiddleware = require('../middleware/cacheMiddleware');

// =========== PUBLIC ROUTES ===========
// Cache public circles list for 5 minutes (300 seconds)
router.get('/', cacheMiddleware(300), circleController.getPublicCircles);
router.get('/:slug', circleController.getCircleBySlug);
router.get('/:circleId/members', circleController.getCircleMembers);

// =========== PROTECTED ROUTES ===========
router.use(protect); // All routes below require authentication

// Circle CRUD
router.post('/', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), circleController.createCircle);
router.get('/my-circles/list', circleController.getMyCircles);
router.put('/:circleId', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), circleController.updateCircle);
router.delete('/:circleId', circleController.deleteCircle);

// Membership
router.post('/:circleId/join', circleController.joinCircle);
router.post('/:circleId/leave', circleController.leaveCircle);

// =========== JOIN REQUEST SYSTEM (PRIVATE CIRCLES) ===========
// User requests to join private circle
router.post('/:circleId/request-join', circleController.requestToJoin);

// Admin views pending requests
router.get('/:circleId/pending-requests', circleController.getPendingRequests);

// Admin views all requests with filters
router.get('/:circleId/requests', circleController.getAllRequests);

// Admin approves/rejects
router.post('/:circleId/requests/:requestId/approve', circleController.approveJoinRequest);
router.post('/:circleId/requests/:requestId/reject', circleController.rejectJoinRequest);

// =========== MODERATION ===========
router.post('/:circleId/moderators', circleController.addModerator);
router.delete('/:circleId/moderators/:userId', circleController.removeModerator);
router.delete('/:circleId/members/:userId', circleController.removeMember); // Kick

// Mute/Unmute
router.post('/:circleId/members/:userId/mute', circleController.muteMember);
router.post('/:circleId/members/:userId/unmute', circleController.unmuteMember);

// Ban/Unban
router.post('/:circleId/members/:userId/ban', circleController.banMember);
router.delete('/:circleId/members/:userId/unban', circleController.unbanMember);
router.get('/:circleId/banned-members', circleController.getBannedMembers);

// =========== INVITES ===========
router.post('/:circleId/generate-invite', circleController.generateInviteCode);
router.post('/join/:inviteCode', circleController.joinWithInvite);

module.exports = router;