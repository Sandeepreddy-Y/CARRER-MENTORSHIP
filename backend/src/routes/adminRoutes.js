const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Get all users
router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  adminController.getAllUsers
);

// Get dashboard statistics
router.get(
  '/stats/dashboard',
  authMiddleware,
  adminMiddleware,
  adminController.getDashboardStats
);

// Get user engagement statistics
router.get(
  '/stats/engagement',
  authMiddleware,
  adminMiddleware,
  adminController.getUserEngagementStats
);

// Get user profile (admin view)
router.get(
  '/users/:userId',
  authMiddleware,
  adminMiddleware,
  adminController.getUserProfile
);

// Connect student with counsellor
router.post(
  '/connect',
  authMiddleware,
  adminMiddleware,
  adminController.connectStudentWithCounsellor
);

// Deactivate user
router.put(
  '/users/:userId/deactivate',
  authMiddleware,
  adminMiddleware,
  adminController.deactivateUser
);

module.exports = router;
