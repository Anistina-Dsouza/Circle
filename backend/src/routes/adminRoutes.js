const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  toggleUserSuspension,
  getAllCircles,
  toggleCircleStatus,
  dismissReports,
  getItemReports,
  getDetailedResonance,
  getCommunityDistribution,
  getActivityLogs,
  getConversationalVelocity
} = require('../controllers/adminController');

const { adminAuth } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
router.get('/dashboard', adminAuth, getDashboardStats);

// @route   GET /api/admin/users
router.get('/users', adminAuth, getAllUsers);

// @route   PUT /api/admin/users/:id/suspend
router.put('/users/:id/suspend', adminAuth, toggleUserSuspension);

// @route   GET /api/admin/circles
router.get('/circles', adminAuth, getAllCircles);

// @route   PUT /api/admin/circles/:id/status
router.put('/circles/:id/status', adminAuth, toggleCircleStatus);

// @route   GET /api/admin/reports/:itemId
router.get('/reports/:itemId', adminAuth, getItemReports);

// @route   PUT /api/admin/reports/:itemId/dismiss
router.put('/reports/:itemId/dismiss', adminAuth, dismissReports);

// @route   GET /api/admin/resonance/detailed
router.get('/resonance/detailed', adminAuth, getDetailedResonance);

// @route   GET /api/admin/distribution
router.get('/distribution', adminAuth, getCommunityDistribution);

// @route   GET /api/admin/activity
router.get('/activity', adminAuth, getActivityLogs);

// @route   GET /api/admin/velocity
router.get('/velocity', adminAuth, getConversationalVelocity);

module.exports = router;
