const mongoose = require('mongoose');

const nameEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  style: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    default: ''
  }
});

const businessNameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true
  },
  stylePreference: {
    type: String,
    required: true
  },
  names: [nameEntrySchema],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  nameCount: {
    type: Number,
    required: true
  }
});

// Updated indexes
//businessNameSchema.index({ user: 1 });
//businessNameSchema.index({ sessionId: 1 });
businessNameSchema.index({ industry: 1 });
businessNameSchema.index({ generatedAt: -1 });
//businessNameSchema.index({ user: 1, generatedAt: -1 });

module.exports = mongoose.model('BusinessName', businessNameSchema);