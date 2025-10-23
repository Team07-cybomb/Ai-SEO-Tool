const mongoose = require('mongoose');

const keywordIntentSchema = new mongoose.Schema({
  informational: [{ type: String }],
  navigational: [{ type: String }],
  transactional: [{ type: String }],
  commercial: [{ type: String }]
}, { _id: false });

const scrapedPageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  depth: { type: Number, required: true },
  title: { type: String, default: '' },
  content: [{ type: String }],
  foundLinks: { type: Number, default: 0 },
  keywords: [{
    word: { type: String, required: true },
    count: { type: Number, required: true }
  }],
  contentLength: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
  error: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const keyScrapeReportSchema = new mongoose.Schema({
  // Report Metadata
  reportId: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2) + Date.now().toString(36)
  },
  mainUrl: {
    type: String,
    required: true,
    index: true
  },
  domain: {
    type: String,
    required: true,
    index: true
  },
  
  // Analysis Results (what's displayed on frontend)
  keywordData: {
    primary_keywords: [{ type: String }],
    secondary_keywords: [{ type: String }],
    long_tail_keywords: [{ type: String }],
    related_keywords: [{ type: String }],
    keyword_intent: keywordIntentSchema
  },
  
  // Raw Scraped Data
  scrapedPages: [scrapedPageSchema],
  
  // Analysis Metadata
  totalPagesScraped: { type: Number, required: true },
  totalKeywordsFound: { type: Number, required: true },
  analysisType: {
    type: String,
    enum: ['n8n_analysis', 'fallback_analysis'],
    required: true
  },
  analysisError: { type: String },
  
  // Timestamps
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
keyScrapeReportSchema.index({ createdAt: -1 });
keyScrapeReportSchema.index({ domain: 1, createdAt: -1 });
keyScrapeReportSchema.index({ 'keywordData.primary_keywords': 'text' });

// Virtual for report duration
keyScrapeReportSchema.virtual('duration').get(function() {
  return this.completedAt - this.startedAt;
});

// Method to get summary
keyScrapeReportSchema.methods.getSummary = function() {
  return {
    reportId: this.reportId,
    mainUrl: this.mainUrl,
    domain: this.domain,
    totalPages: this.totalPagesScraped,
    totalKeywords: this.totalKeywordsFound,
    primaryKeywords: this.keywordData.primary_keywords.length,
    analysisType: this.analysisType,
    duration: this.duration,
    createdAt: this.createdAt
  };
};

// Static method to find recent reports for a domain
keyScrapeReportSchema.statics.findByDomain = function(domain, limit = 5) {
  return this.find({ domain })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('reportId mainUrl totalPagesScraped totalKeywordsFound createdAt');
};

module.exports = mongoose.model('KeyScrapeReport', keyScrapeReportSchema);