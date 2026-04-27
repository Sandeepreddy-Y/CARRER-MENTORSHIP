const mongoose = require('mongoose');

const careerResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Engineering',
      'Business',
      'Healthcare',
      'IT',
      'Finance',
      'Creative',
      'Education',
      'Other'
    ]
  },
  skills: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  jobOutlook: String,
  educationRequired: String,
  resourceLinks: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['article', 'video', 'course', 'book', 'website']
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerResource', careerResourceSchema);
