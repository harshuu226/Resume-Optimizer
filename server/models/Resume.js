const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  improvedText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fileName: {
    type: String,
    default: 'resume'
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    default: 'pdf'
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
