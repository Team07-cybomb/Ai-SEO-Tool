const KeywordReport = require('../models/KeywordReport');

// Save generated keyword report
exports.saveKeywordReport = async (req, res) => {
  try {
    // console.log('📥 Received request to save keyword report:', {
    //   topic: req.body.topic,
    //   industry: req.body.industry,
    //   audience: req.body.audience,
    //   keywordCount: req.body.keywords?.length,
    //   sessionId: req.body.sessionId
    // });

    const { topic, industry, audience, keywords, sessionId } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      //console.log('❌ No keywords provided');
      return res.status(400).json({
        success: false,
        message: 'No keywords provided to save'
      });
    }

    if (!topic || !industry || !audience) {
      //console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: topic, industry, audience'
      });
    }

    // Check if session already exists
    const existingSession = await KeywordReport.findOne({ sessionId });
    if (existingSession) {
     // console.log('❌ Session ID already exists:', sessionId);
      return res.status(400).json({
        success: false,
        message: 'Session ID already exists'
      });
    }

    //console.log('💾 Creating new keyword report document...');

    // Calculate values manually to ensure they're set
    const keywordCount = keywords.length;
    const totalSearchVolume = keywords.reduce((sum, keyword) => sum + (keyword.search_volume || 0), 0);
    const totalCPC = keywords.reduce((sum, keyword) => sum + (keyword.cpc || 0), 0);
    const averageCPC = keywords.length > 0 ? totalCPC / keywords.length : 0;

    // Create single document with all keywords
    const keywordReport = new KeywordReport({
      sessionId,
      topic,
      industry,
      audience,
      keywords: keywords.map(keyword => ({
        keyword: keyword.keyword || "Unknown Keyword",
        type: keyword.type || "General",
        difficulty_score: keyword.difficulty_score || "Medium",
        search_volume: keyword.search_volume || 0,
        cpc: keyword.cpc || 0,
        intent: keyword.intent || "informational",
        content_type: keyword.content_type || "Blog Post",
        keyword_density: keyword.keyword_density || 0,
        content_idea: keyword.content_idea || "No content idea provided."
      })),
      keywordCount, // Manually set required field
      totalSearchVolume, // Manually set
      averageCPC // Manually set
    });

    const savedReport = await keywordReport.save();
    //console.log('✅ Successfully saved to MongoDB. Document ID:', savedReport._id);
    // console.log('📊 Report details:', {
    //   keywordCount: savedReport.keywordCount,
    //   totalSearchVolume: savedReport.totalSearchVolume,
    //   averageCPC: savedReport.averageCPC,
    //   sessionId: savedReport.sessionId
    // });

    res.status(201).json({
      success: true,
      message: 'Keyword report saved successfully',
      data: {
        sessionId: savedReport.sessionId,
        objectId: savedReport._id,
        keywordCount: savedReport.keywordCount,
        totalSearchVolume: savedReport.totalSearchVolume,
        averageCPC: savedReport.averageCPC,
        generatedAt: savedReport.generatedAt
      }
    });

  } catch (error) {
    //console.error('❌ Error saving keyword report:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Session ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save keyword report',
      error: error.message
    });
  }
};

// Get keyword report by session ID
exports.getKeywordReportBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    //console.log('🔍 Fetching keyword report for session:', sessionId);

    const report = await KeywordReport.findOne({ sessionId });

    if (!report) {
      //console.log('❌ Keyword report not found for session:', sessionId);
      return res.status(404).json({
        success: false,
        message: 'Keyword report not found'
      });
    }

    //console.log('✅ Found keyword report:', report._id);
    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    //console.error('❌ Error fetching keyword report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch keyword report',
      error: error.message
    });
  }
};

// Get all keyword reports (paginated)
exports.getAllKeywordReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, topic } = req.query;

    //console.log('📋 Fetching all keyword reports:', { page, limit, industry, topic });

    const filter = {};
    if (industry) filter.industry = new RegExp(industry, 'i');
    if (topic) filter.topic = new RegExp(topic, 'i');

    const reports = await KeywordReport.find(filter)
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId topic industry audience keywordCount totalSearchVolume averageCPC generatedAt');

    const total = await KeywordReport.countDocuments(filter);

    //console.log(`✅ Found ${reports.length} reports out of ${total} total`);

    res.json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReports: total
      }
    });

  } catch (error) {
    //console.error('❌ Error fetching keyword reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch keyword reports',
      error: error.message
    });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    //console.log('📊 Generating analytics data...');

    const totalReports = await KeywordReport.countDocuments();
    const totalKeywords = await KeywordReport.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$keywordCount' }
        }
      }
    ]);

    const industryStats = await KeywordReport.aggregate([
      {
        $group: {
          _id: '$industry',
          reportCount: { $sum: 1 },
          keywordCount: { $sum: '$keywordCount' },
          avgSearchVolume: { $avg: '$totalSearchVolume' },
          avgCPC: { $avg: '$averageCPC' }
        }
      },
      { $sort: { reportCount: -1 } }
    ]);

    const topicStats = await KeywordReport.aggregate([
      {
        $group: {
          _id: '$topic',
          reportCount: { $sum: 1 }
        }
      },
      { $sort: { reportCount: -1 } },
      { $limit: 10 }
    ]);

    const recentActivity = await KeywordReport.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$generatedAt'
            }
          },
          reports: { $sum: 1 },
          keywords: { $sum: '$keywordCount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    //console.log('✅ Analytics generated successfully');

    res.json({
      success: true,
      data: {
        totalReports,
        totalKeywords: totalKeywords[0]?.total || 0,
        industryStats,
        topicStats,
        recentActivity
      }
    });

  } catch (error) {
    //console.error('❌ Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Delete keyword report by sessionId
exports.deleteKeywordReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    //console.log('🗑️ Attempting to delete keyword report:', sessionId);

    const result = await KeywordReport.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      //console.log('❌ Keyword report not found for deletion:', sessionId);
      return res.status(404).json({
        success: false,
        message: 'Keyword report not found'
      });
    }

    //console.log('✅ Keyword report deleted successfully:', sessionId);

    res.json({
      success: true,
      message: 'Keyword report deleted successfully'
    });

  } catch (error) {
    //console.error('❌ Error deleting keyword report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete keyword report',
      error: error.message
    });
  }
};

// Get keyword reports by industry
exports.getKeywordReportsByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    const { page = 1, limit = 10 } = req.query;

    //console.log('🏢 Fetching reports for industry:', industry);

    const reports = await KeywordReport.find({ industry: new RegExp(industry, 'i') })
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId topic industry audience keywordCount totalSearchVolume averageCPC generatedAt');

    const total = await KeywordReport.countDocuments({ industry: new RegExp(industry, 'i') });

    //console.log(`✅ Found ${reports.length} reports for industry: ${industry}`);

    res.json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReports: total
      }
    });

  } catch (error) {
    //console.error('❌ Error fetching reports by industry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports by industry',
      error: error.message
    });
  }
};

// Get keyword reports by topic
exports.getKeywordReportsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const { page = 1, limit = 10 } = req.query;

    //console.log('🔍 Fetching reports for topic:', topic);

    const reports = await KeywordReport.find({ topic: new RegExp(topic, 'i') })
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId topic industry audience keywordCount totalSearchVolume averageCPC generatedAt');

    const total = await KeywordReport.countDocuments({ topic: new RegExp(topic, 'i') });

    //console.log(`✅ Found ${reports.length} reports for topic: ${topic}`);

    res.json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReports: total
      }
    });

  } catch (error) {
    //console.error('❌ Error fetching reports by topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports by topic',
      error: error.message
    });
  }
};

// Health check for keyword routes
exports.healthCheck = async (req, res) => {
  try {
    // Test database connection
    const dbStatus = await KeywordReport.db.db.admin().ping();
    
    res.json({
      success: true,
      message: 'Keyword API is healthy',
      database: dbStatus.ok === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    //console.error('❌ Health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Keyword API health check failed',
      error: error.message
    });
  }
};