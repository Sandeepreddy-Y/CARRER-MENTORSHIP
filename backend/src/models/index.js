const User = require('./User');
const CareerResource = require('./CareerResource');
const CounsellingSession = require('./CounsellingSession');
const UserEngagement = require('./UserEngagement');

// User and CareerResource (One-to-Many)
User.hasMany(CareerResource, { foreignKey: 'createdBy', as: 'createdResources' });
CareerResource.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User and CounsellingSession (Student)
User.hasMany(CounsellingSession, { foreignKey: 'studentId', as: 'studentSessions' });
CounsellingSession.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// User and CounsellingSession (Counsellor)
User.hasMany(CounsellingSession, { foreignKey: 'counsellorId', as: 'counsellorSessions' });
CounsellingSession.belongsTo(User, { foreignKey: 'counsellorId', as: 'counsellor' });

// User and UserEngagement
User.hasMany(UserEngagement, { foreignKey: 'userId', as: 'engagements' });
UserEngagement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  CareerResource,
  CounsellingSession,
  UserEngagement
};
