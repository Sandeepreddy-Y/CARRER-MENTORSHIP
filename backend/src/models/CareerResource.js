const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CareerResource = sequelize.define('CareerResource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'Engineering',
      'Business',
      'Healthcare',
      'IT',
      'Finance',
      'Creative',
      'Education',
      'Other'
    ),
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  salary: {
    type: DataTypes.JSON, // Storing { min, max, currency }
  },
  jobOutlook: {
    type: DataTypes.STRING,
  },
  educationRequired: {
    type: DataTypes.STRING,
  },
  resourceLinks: {
    type: DataTypes.JSON, // Storing array of { title, url, type }
    defaultValue: [],
  },
  createdBy: {
    type: DataTypes.UUID, // FK to User
  }
});

module.exports = CareerResource;
