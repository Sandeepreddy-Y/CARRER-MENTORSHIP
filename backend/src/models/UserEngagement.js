const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserEngagement = sequelize.define('UserEngagement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  actionType: {
    type: DataTypes.ENUM(
      'view_resource',
      'schedule_session',
      'complete_session',
      'view_careerpath',
      'take_quiz',
      'download_material'
    ),
    allowNull: false,
  },
  resourceId: {
    type: DataTypes.STRING, // Kept as string since it might refer to different types of resources
  },
  details: {
    type: DataTypes.JSON, // Using JSON for mixed data
  }
}, {
  indexes: [
    {
      fields: ['userId', 'createdAt']
    }
  ]
});

module.exports = UserEngagement;
