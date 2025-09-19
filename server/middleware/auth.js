const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require("../controllers/authController");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 🔹 Step 1: Check if token is blacklisted
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ msg: 'Token has been logged out. Please log in again.' });
    }

    try {
        // Debugging log
        console.log('JWT_SECRET inside middleware:', JWT_SECRET);

        // 🔹 Step 2: Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 🔹 Step 3: Attach user info to request
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error('Token validation failed:', e.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
