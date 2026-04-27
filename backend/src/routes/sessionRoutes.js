const express = require('express');
const { authMiddleware, counsellorMiddleware } = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

// Get available counsellors (authenticated)
router.get('/counsellors/available', authMiddleware, sessionController.getAvailableCounsellors);

// Schedule session
router.post(
  '/',
  authMiddleware,
  sessionController.scheduleSession
);

// Get sessions for current user
router.get(
  '/',
  authMiddleware,
  sessionController.getUserSessions
);

// Get session by ID
router.get(
  '/:id',
  authMiddleware,
  sessionController.getSessionById
);

// Update session status (counsellor only)
router.put(
  '/:id',
  authMiddleware,
  sessionController.updateSessionStatus
);

// Cancel session
router.delete(
  '/:id',
  authMiddleware,
  sessionController.cancelSession
);

module.exports = router;
