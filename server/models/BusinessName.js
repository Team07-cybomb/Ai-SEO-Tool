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
  names: [nameEntrySchema], // Array of name objects
  generatedAt: {
    type: Date,
    default: Date.now
  },
  nameCount: {
    type: Number,
    required: true
  }
});

// Index for better query performance
businessNameSchema.index({ sessionId: 1 });
businessNameSchema.index({ industry: 1 });
businessNameSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('BusinessName', businessNameSchema);