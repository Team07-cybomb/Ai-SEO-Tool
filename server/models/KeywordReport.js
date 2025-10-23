const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  difficulty_score: {
    type: String,
    required: true
  },
  search_volume: {
    type: Number,
    required: true,
    default: 0
  },
  cpc: {
    type: Number,
    required: true,
    default: 0
  },
  intent: {
    type: String,
    required: true
  },
  content_type: {
    type: String,
    required: true
  },
  keyword_density: {
    type: Number,
    required: true,
    default: 0
  },
  content_idea: {
    type: String,
    required: true
  }
});

const keywordReportSchema = new mongoose.Schema({
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
  topic: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true
  },
  keywords: [keywordSchema],
  keywordCount: {
    type: Number,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  totalSearchVolume: {
    type: Number,
    default: 0
  },
  averageCPC: {
    type: Number,
    default: 0
  }
});

// Updated indexes
keywordReportSchema.index({ user: 1 });
//keywordReportSchema.index({ sessionId: 1 });
keywordReportSchema.index({ topic: 1 });
keywordReportSchema.index({ industry: 1 });
keywordReportSchema.index({ generatedAt: -1 });
keywordReportSchema.index({ user: 1, generatedAt: -1 });

// Pre-save middleware to calculate totals
keywordReportSchema.pre('save', function(next) {
  this.keywordCount = this.keywords.length;
  this.totalSearchVolume = this.keywords.reduce((sum, keyword) => sum + keyword.search_volume, 0);
  this.averageCPC = this.keywords.reduce((sum, keyword) => sum + keyword.cpc, 0) / this.keywords.length;
  next();
});

module.exports = mongoose.model('KeywordReport', keywordReportSchema);