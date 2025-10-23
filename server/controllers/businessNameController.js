const BusinessName = require('../models/BusinessName');

// Save generated names as a single document
exports.saveGeneratedNames = async (req, res) => {
  try {
    const { names, industry, audience, stylePreference, sessionId } = req.body;

    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No names provided to save'
      });
    }

    // Check if session already exists
    const existingSession = await BusinessName.findOne({ sessionId });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Session ID already exists'
      });
    }

    // Create single document with all names
    const businessNameDoc = new BusinessName({
      sessionId,
      industry,
      audience,
      stylePreference,
      names: names.map(name => ({
        name: name.name,
        style: name.style,
        tagline: name.tagline
      })),
      nameCount: names.length
    });

    const savedDoc = await businessNameDoc.save();

    res.status(201).json({
      success: true,
      message: 'Names saved successfully as single document',
      data: {
        sessionId: savedDoc.sessionId,
        objectId: savedDoc._id,
        nameCount: savedDoc.nameCount,
        generatedAt: savedDoc.generatedAt
      }
    });

  } catch (error) {
    console.error('Error saving names to database:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Session ID already exists',
        error: 'Duplicate session'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save names to database',
      error: error.message
    });
  }
};

// Get names by session ID
exports.getNamesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await BusinessName.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        objectId: session._id,
        industry: session.industry,
        audience: session.audience,
        stylePreference: session.stylePreference,
        names: session.names,
        nameCount: session.nameCount,
        generatedAt: session.generatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
      error: error.message
    });
  }
};

// Get all sessions (for admin/list view)
exports.getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const sessions = await BusinessName.find()
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId industry audience stylePreference nameCount generatedAt');

    const total = await BusinessName.countDocuments();

    res.json({
      success: true,
      data: sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSessions: total
      }
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message
    });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const totalSessions = await BusinessName.countDocuments();
    const totalNames = await BusinessName.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$nameCount' }
        }
      }
    ]);
    
    const industryStats = await BusinessName.aggregate([
      {
        $group: {
          _id: '$industry',
          sessionCount: { $sum: 1 },
          nameCount: { $sum: '$nameCount' }
        }
      },
      { $sort: { sessionCount: -1 } }
    ]);

    const styleStats = await BusinessName.aggregate([
      {
        $group: {
          _id: '$stylePreference',
          sessionCount: { $sum: 1 },
          nameCount: { $sum: '$nameCount' }
        }
      },
      { $sort: { sessionCount: -1 } }
    ]);

    const recentActivity = await BusinessName.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$generatedAt'
            }
          },
          sessions: { $sum: 1 },
          names: { $sum: '$nameCount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      success: true,
      data: {
        totalSessions,
        totalNames: totalNames[0]?.total || 0,
        industryStats,
        styleStats,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Delete session by sessionId
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await BusinessName.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message
    });
  }
};

// Helper function to generate session ID
function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}