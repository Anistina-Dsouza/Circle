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

// Moderation
router.post('/:circleId/moderators', circleController.addModerator);
router.delete('/:circleId/moderators/:userId', circleController.removeModerator);

// Invites
router.post('/:circleId/generate-invite', circleController.generateInviteCode);
router.post('/join/:inviteCode', circleController.joinWithInvite);

// Ownership
router.post('/:circleId/transfer-ownership', circleController.transferOwnership);

module.exports = router;