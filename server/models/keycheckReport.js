const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true
  },
  intent: {
    type: String,
    required: true,
    enum: ['informational', 'navigational', 'transactional', 'commercial', 'N/A']
  },
  difficulty: {
    type: String,
    default: "N/A"
  },
  frequency: {
    type: String,
    default: "N/A"
  },
  relevance_score: {
    type: Number,
    default: 0
  },
  search_volume: {
    type: String,
    default: "N/A"
  },
  related_keywords: [{
    type: String
  }]
});

const keywordSummarySchema = new mongoose.Schema({
  primary_keywords: [{
    type: String
  }],
  secondary_keywords: [{
    type: String
  }],
  keyword_gaps: [{
    type: String
  }]
});

const scrapedPageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  content: [{
    type: String
  }],
  foundLinks: {
    type: Number,
    default: 0
  },
  keywords: [{
    word: String,
    count: Number
  }],
  contentLength: {
    type: Number,
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const keycheckReportSchema = new mongoose.Schema({
  // Basic report information
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  mainUrl: {
    type: String,
    required: true,
    trim: true
  },
  totalScraped: {
    type: Number,
    required: true
  },
  
  // Analysis data
  keywords: [keywordSchema],
  summary: keywordSummarySchema,
  recommendations: [{
    type: String
  }],
  pages: [scrapedPageSchema],
  
  // Analysis metadata
  analysis: {
    sentToN8n: {
      type: Boolean,
      default: false
    },
    dataOptimized: {
      type: Boolean,
      default: false
    },
    fallback: {
      type: Boolean,
      default: false
    },
    n8nError: {
      type: String,
      default: null
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Status
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  
  // Performance metrics
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  }
});

// Update the updatedAt field before saving
keycheckReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to generate report ID
keycheckReportSchema.statics.generateReportId = function() {
  return `KR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Index for faster queries
keycheckReportSchema.index({ mainUrl: 1, createdAt: -1 });
keycheckReportSchema.index({ reportId: 1 });
keycheckReportSchema.index({ createdAt: -1 });
keycheckReportSchema.index({ status: 1 });

const KeycheckReport = mongoose.model('KeycheckReport', keycheckReportSchema);

module.exports = KeycheckReport;