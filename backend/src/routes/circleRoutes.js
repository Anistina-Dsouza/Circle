const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const circleController = require('../controllers/circleController');

// =========== PUBLIC ROUTES ===========
router.get('/', circleController.getPublicCircles);
router.get('/:slug', circleController.getCircleBySlug);
router.get('/:circleId/members', circleController.getCircleMembers);

// =========== PROTECTED ROUTES ===========
router.use(protect); // All routes below require authentication

// Circle CRUD
router.post('/', circleController.createCircle);
router.get('/my-circles/list', circleController.getMyCircles);
router.put('/:circleId', circleController.updateCircle);
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

// =========== INVITES ===========
router.post('/:circleId/generate-invite', circleController.generateInviteCode);
router.post('/join/:inviteCode', circleController.joinWithInvite);

module.exports = router;