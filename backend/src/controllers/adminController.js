const { User, UserEngagement, CounsellingSession, CareerResource } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let whereClause = {};

    if (role) whereClause.role = role;
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user engagement statistics
exports.getUserEngagementStats = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    let whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }
    if (userId) whereClause.userId = userId;

    const engagementData = await UserEngagement.findAll({
      where: whereClause,
      attributes: [
        'actionType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['actionType']
    });

    const totalEngagements = await UserEngagement.count({ where: whereClause });
    const activeUsers = await UserEngagement.count({
      where: whereClause,
      distinct: true,
      col: 'userId'
    });

    res.json({
      engagementByType: engagementData.map(e => ({ _id: e.actionType, count: e.dataValues.count })),
      totalEngagements,
      activeUsersCount: activeUsers,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const studentCount = await User.count({ where: { role: 'student' } });
    const counsellorCount = await User.count({ where: { role: 'counsellor' } });
    const totalSessions = await CounsellingSession.count();
    const completedSessions = await CounsellingSession.count({ where: { status: 'completed' } });
    const totalResources = await CareerResource.count();
    const totalEngagements = await UserEngagement.count();

    // Get sessions by status
    const sessionsByStatusRaw = await CounsellingSession.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    const sessionsByStatus = sessionsByStatusRaw.map(s => ({
      _id: s.status, count: s.dataValues.count
    }));

    // Get top resources by views
    const topResourcesRaw = await UserEngagement.findAll({
      where: { actionType: 'view_resource' },
      attributes: [
        'resourceId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'viewCount']
      ],
      group: ['resourceId'],
      order: [[sequelize.literal('viewCount'), 'DESC']],
      limit: 5
    });

    // Manually populate resources since we need to fetch them
    const topResources = await Promise.all(topResourcesRaw.map(async (r) => {
      const resource = await CareerResource.findByPk(r.resourceId);
      return {
        _id: r.resourceId,
        viewCount: r.dataValues.viewCount,
        resource: resource ? [resource] : []
      };
    }));

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
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's engagement data
    const engagementData = await UserEngagement.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get user's sessions
    let sessions = [];
    if (user.role === 'student') {
      sessions = await CounsellingSession.findAll({
        where: { studentId: req.params.userId },
        include: [{ model: User, as: 'counsellor', attributes: ['name'] }],
        limit: 10
      });
    } else if (user.role === 'counsellor') {
      sessions = await CounsellingSession.findAll({
        where: { counsellorId: req.params.userId },
        include: [{ model: User, as: 'student', attributes: ['name'] }],
        limit: 10
      });
    }

    res.json({
      user,
      recentEngagement: engagementData,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Connect student with counsellor (Admin action)
exports.connectStudentWithCounsellor = async (req, res) => {
  try {
    const { studentId, counsellorId } = req.body;

    const student = await User.findByPk(studentId);
    const counsellor = await User.findByPk(counsellorId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!counsellor || counsellor.role !== 'counsellor') {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    // Create a session to connect them
    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const session = await CounsellingSession.create({
      studentId: studentId,
      counsellorId: counsellorId,
      title: 'Initial Counseling Session',
      description: 'Initial counseling session set up by admin',
      scheduledDate: scheduledDate
    });

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
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'deactivated';
    await user.save();
    
    // Return without password
    const userJSON = user.toJSON();
    delete userJSON.password;

    res.json({
      message: 'User account deactivated successfully',
      user: userJSON
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
