const { CounsellingSession, User, UserEngagement } = require('../models');

// Schedule a counselling session
exports.scheduleSession = async (req, res) => {
  try {
    const { counsellorId, title, description, scheduledDate, duration } = req.body;

    // Verify counsellor exists and has correct role
    const counsellor = await User.findByPk(counsellorId);
    if (!counsellor || counsellor.role !== 'counsellor') {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    const session = await CounsellingSession.create({
      studentId: req.user.id,
      counsellorId: counsellorId,
      title,
      description,
      scheduledDate,
      duration: duration || 60
    });

    // Track engagement
    await UserEngagement.create({
      userId: req.user.id,
      actionType: 'schedule_session',
      resourceId: session.id
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
    let whereClause = {};

    // If admin, get all sessions; if student/counsellor, get their sessions
    if (req.user.role === 'admin') {
      whereClause = {};
    } else if (req.user.role === 'student') {
      whereClause = { studentId: req.user.id };
    } else if (req.user.role === 'counsellor') {
      whereClause = { counsellorId: req.user.id };
    }

    const sessions = await CounsellingSession.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'counsellor', attributes: ['name', 'email', 'phone', 'bio'] }
      ],
      order: [['scheduledDate', 'DESC']]
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await CounsellingSession.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'counsellor', attributes: ['name', 'email', 'phone', 'bio'] }
      ]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (
      session.studentId !== req.user.id &&
      session.counsellorId !== req.user.id &&
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

    let session = await CounsellingSession.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only counsellor or admin can update session
    if (session.counsellorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    if (status) session.status = status;
    if (notes) session.notes = notes;
    if (feedback) session.feedback = feedback;

    await session.save();

    // Track engagement if completed
    if (status === 'completed') {
      await UserEngagement.create({
        userId: session.studentId,
        actionType: 'complete_session',
        resourceId: session.id
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
    const session = await CounsellingSession.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (
      session.studentId !== req.user.id &&
      session.counsellorId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this session' });
    }

    session.status = 'cancelled';
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
    const counsellors = await User.findAll({ 
      where: { role: 'counsellor' },
      attributes: ['id', 'name', 'bio', 'email', 'phone', 'interests', 'skills']
    });
    res.json(counsellors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
