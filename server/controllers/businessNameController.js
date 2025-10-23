const BusinessName = require('../models/BusinessName');


// Save generated names as a single document
exports.saveGeneratedNames = async (req, res) => {
  try {
    const { names, industry, audience, stylePreference, sessionId } = req.body;
    
    // Debug what we're receiving
    //console.log('Request user:', req.user);
    //console.log('Request body:', { industry, audience, stylePreference, sessionId, namesCount: names?.length });
    
    const userId = req.user.id; // Get user from authenticated request

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No names provided to save'
      });
    }

    // Check if session already exists for this user
    const existingSession = await BusinessName.findOne({ sessionId, user: userId });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Session ID already exists'
      });
    }

    // Create single document with all names
    const businessNameDoc = new BusinessName({
      user: userId, // Make sure this is set
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

    //console.log('Saving document with user:', userId);
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
    //console.error('Error saving names to database:', error);
    
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
};;

// Get names by session ID
exports.getNamesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await BusinessName.findOne({ sessionId, user: userId });

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

// Get all sessions for the authenticated user
exports.getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const sessions = await BusinessName.find({ user: userId })
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId industry audience stylePreference nameCount generatedAt');

    const total = await BusinessName.countDocuments({ user: userId });

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

// Get analytics data for the authenticated user
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalSessions = await BusinessName.countDocuments({ user: userId });
    const totalNames = await BusinessName.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: '$nameCount' }
        }
      }
    ]);
    
    const industryStats = await BusinessName.aggregate([
      { $match: { user: userId } },
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
      { $match: { user: userId } },
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
      { $match: { user: userId } },
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

// Delete session by sessionId for the authenticated user
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const result = await BusinessName.deleteOne({ sessionId, user: userId });

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