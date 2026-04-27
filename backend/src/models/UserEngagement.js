const mongoose = require('mongoose');

const userEngagementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: [
      'view_resource',
      'schedule_session',
      'complete_session',
      'view_careerpath',
      'take_quiz',
      'download_material'
    ],
    required: true
  },
  resourceId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
userEngagementSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('UserEngagement', userEngagementSchema);
