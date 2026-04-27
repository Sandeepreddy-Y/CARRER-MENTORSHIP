const CounsellingSession = require('../models/CounsellingSession');
const User = require('../models/User');
const UserEngagement = require('../models/UserEngagement');

// Schedule a counselling session
exports.scheduleSession = async (req, res) => {
  try {
    const { counsellorId, title, description, scheduledDate, duration } = req.body;

    // Verify counsellor exists and has correct role
    const counsellor = await User.findById(counsellorId);
    if (!counsellor || counsellor.role !== 'counsellor') {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    const session = new CounsellingSession({
      student: req.user.id,
      counsellor: counsellorId,
      title,
      description,
      scheduledDate,
      duration: duration || 60
    });

    await session.save();

    // Track engagement
    await UserEngagement.create({
      user: req.user.id,
      actionType: 'schedule_session',
      resourceId: session._id
    });

    res.status(201).json({
      message: 'Counselling session scheduled successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sessions for current user
exports.getUserSessions = async (req, res) => {
  try {
    let query = {};

    // If admin, get all sessions; if student/counsellor, get their sessions
    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'student') {
      query = { student: req.user.id };
    } else if (req.user.role === 'counsellor') {
      query = { counsellor: req.user.id };
    }

    const sessions = await CounsellingSession.find(query)
      .populate('student', 'name email phone')
      .populate('counsellor', 'name email phone bio')
      .sort({ scheduledDate: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await CounsellingSession.findById(req.params.id)
      .populate('student', 'name email phone')
      .populate('counsellor', 'name email phone bio');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (
      session.student._id.toString() !== req.user.id &&
      session.counsellor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update session status
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status, notes, feedback } = req.body;

    let session = await CounsellingSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only counsellor or admin can update session
    if (session.counsellor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    if (status) session.status = status;
    if (notes) session.notes = notes;
    if (feedback) session.feedback = feedback;

    session.updatedAt = Date.now();
    await session.save();

    // Track engagement if completed
    if (status === 'completed') {
      await UserEngagement.create({
        user: session.student,
        actionType: 'complete_session',
        resourceId: session._id
      });
    }

    res.json({
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel session
exports.cancelSession = async (req, res) => {
  try {
    const session = await CounsellingSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (
      session.student.toString() !== req.user.id &&
      session.counsellor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this session' });
    }

    session.status = 'cancelled';
    session.updatedAt = Date.now();
    await session.save();

    res.json({
      message: 'Session cancelled successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available counsellors
exports.getAvailableCounsellors = async (req, res) => {
  try {
    const counsellors = await User.find({ role: 'counsellor' }).select('name bio email phone interests skills');
    res.json(counsellors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
