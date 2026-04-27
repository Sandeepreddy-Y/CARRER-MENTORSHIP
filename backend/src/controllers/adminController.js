const User = require('../models/User');
const UserEngagement = require('../models/UserEngagement');
const CounsellingSession = require('../models/CounsellingSession');
const CareerResource = require('../models/CareerResource');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user engagement statistics
exports.getUserEngagementStats = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (userId) query.user = userId;

    const engagementData = await UserEngagement.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$actionType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEngagements = await UserEngagement.countDocuments(query);
    const activeUsers = await UserEngagement.distinct('user', query);

    res.json({
      engagementByType: engagementData,
      totalEngagements,
      activeUsersCount: activeUsers.length,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const counsellorCount = await User.countDocuments({ role: 'counsellor' });
    const totalSessions = await CounsellingSession.countDocuments();
    const completedSessions = await CounsellingSession.countDocuments({ status: 'completed' });
    const totalResources = await CareerResource.countDocuments();
    const totalEngagements = await UserEngagement.countDocuments();

    // Get sessions by status
    const sessionsByStatus = await CounsellingSession.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top resources by views
    const topResources = await UserEngagement.aggregate([
      { $match: { actionType: 'view_resource' } },
      {
        $group: {
          _id: '$resourceId',
          viewCount: { $sum: 1 }
        }
      },
      { $sort: { viewCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'careerresources',
          localField: '_id',
          foreignField: '_id',
          as: 'resource'
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        students: studentCount,
        counsellors: counsellorCount
      },
      sessions: {
        total: totalSessions,
        completed: completedSessions,
        byStatus: sessionsByStatus
      },
      resources: {
        total: totalResources
      },
      engagement: {
        total: totalEngagements
      },
      topResources
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile for admin view
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's engagement data
    const engagementData = await UserEngagement.find({ user: req.params.userId }).sort({ createdAt: -1 }).limit(10);

    // Get user's sessions
    const sessions = []
      .concat(
        await CounsellingSession.find({ student: req.params.userId }).populate('counsellor', 'name')
      )
      .concat(
        user.role === 'counsellor' ? await CounsellingSession.find({ counsellor: req.params.userId }).populate('student', 'name') : []
      );

    res.json({
      user,
      recentEngagement: engagementData,
      sessions: sessions.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Connect student with counsellor (Admin action)
exports.connectStudentWithCounsellor = async (req, res) => {
  try {
    const { studentId, counsellorId } = req.body;

    const student = await User.findById(studentId);
    const counsellor = await User.findById(counsellorId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!counsellor || counsellor.role !== 'counsellor') {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    // Create a session to connect them
    const session = new CounsellingSession({
      student: studentId,
      counsellor: counsellorId,
      title: 'Initial Counseling Session',
      description: 'Initial counseling session set up by admin',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await session.save();

    res.status(201).json({
      message: 'Student connected with counsellor successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Deactivate user account
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: 'deactivated' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User account deactivated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
