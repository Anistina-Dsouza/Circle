const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  toggleUserSuspension,
  getAllCircles,
  toggleCircleStatus 
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

module.exports = router;
