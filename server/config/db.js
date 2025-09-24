const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/ai_seo_tool';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;